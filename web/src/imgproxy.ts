import { ParamBuilder } from "@bitpatty/imgproxy-url-builder";
import { File } from "@selab-2/groep-1-orm";

/***
 * Abstraction over the URl of an ImgProxy instance. Provides a `url` function
 * to retrieve the location of the server.
 */
export class ImgProxyServer {
  readonly url: string;

  /**
   * A singleton object which contains the information about ImgProxy instance
   * specified in the environment variables.
   * */
  public static env: ImgProxyServer = (() => {
    const url = process.env.VUE_APP_IMGPROXY_SERVER_ADDRESS;

    if (url === undefined) {
      throw new Error("IMGPROXY: Invalid base URL supplied.");
    }

    return new ImgProxyServer(url);
  })();

  constructor(url: string) {
    this.url = url;
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
  url(image: File): string {
    return this.build({
      baseUrl: this.server.url,
      path: `local://images/${image.path}@jpg`,
      plain: true,
    });
  }
}
