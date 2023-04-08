import { ParamBuilder } from "@bitpatty/imgproxy-url-builder";
import { Image } from "@selab-2/groep-1-orm";
import * as process from "process";

/***
 * Abstraction over the URl of an ImgProxy instance. Provides a `url` function
 * to retrieve the location of the server.
 */
export class ImgProxyServer {
  private readonly protocol: "http" | "https";
  private readonly path: string;
  private readonly port: number;
  private readonly root: string;

  /**
   * A singleton object which contains the information about ImgProxy instance
   * specified in the environment variables.
   * */
  public static env: ImgProxyServer = (() => {
    const protocol = process.env.VUE_APP_IMGPROXY_PROTOCOL as "http" | "https";
    const location = process.env.VUE_APP_IMGPROXY_LOCATION;
    const port: number = parseInt(process.env.VUE_APP_IMGPROXY_PORT ?? "");
    const root = process.env.VUE_APP_IMGPROXY_ROOT;

    // Protocol must be either `http` or `https`!
    if (!["http", "https"].includes(protocol)) {
      throw new Error("IMGPROXY: Invalid protocol supplied.");
    }

    if (location === undefined) {
      throw new Error("IMGPROXY: Invalid location supplied.");
    }

    if (Number.isNaN(port)) {
      throw new Error("IMGPROXY: Invalid port supplied.");
    }

    if (root === undefined) {
      throw new Error("IMGPROXY: Invalid root supplied.");
    }

    return new ImgProxyServer(protocol, location, port, root);
  })();

  constructor(
    protocol: "http" | "https",
    path: string,
    port: number,
    root: string,
  ) {
    this.protocol = protocol;
    this.path = path;
    this.port = port;
    this.root = root;
  }

  /**
   * Retrieve the base url of the ImgProxy instance as a single string.
   */
  url(): string {
    return `${this.protocol}://${this.path}:${this.port}/${this.root}`;
  }
}

/**
 * Abstraction over BitPatty's ImgProxy query builder. It allows to easily
 * use the ImgProxyServer instance specified in the environment variables using
 * a singleton `ImgProxy::env` while also accepting `Prisma::Image` objects.
 */
export class ImgProxy extends ParamBuilder {
  private server: ImgProxyServer;

  /**
   * A singleton object which uses the information about the ImgProxy instance
   * specified in the environment variables.
   * */
  public static env: ImgProxy = new ImgProxy(ImgProxyServer.env);

  constructor(server: ImgProxyServer) {
    super();

    // Assign the server variable for further reference
    this.server = server;

    // TODO: Default parameters
  }

  /**
   * Retrieve the source URL of an image that can be served by ImgProxy
   * including the various parameters supplied.
   *
   * For example:
   * <img alt={image.alt} src={ImageProxy.env.width(50).height(50).url(image)}>
   */
  url(image: Image): string {
    if (image.location !== "IMGPROXY") {
      throw new Error("IMGPROXY: Cannot retrieve external image.");
    }

    return this.build({
      baseUrl: this.server.url(),
      path: `local://${image.path}@jpg`,
      plain: true,
    });
  }
}
