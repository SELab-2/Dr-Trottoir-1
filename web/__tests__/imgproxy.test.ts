import { ImgProxy, ImgProxyServer } from "../src/imgproxy";
import { Image } from "@selab-2/groep-1-orm";

const image: Image = {
  id: 0,
  path: "/example.jpg",
  location: "IMGPROXY",
  user_id: 0,
  time: new Date(),
}

const server = new ImgProxyServer(
  "http",
  "localhost",
  3000,
  "path"
)

const instance: ImgProxy = new ImgProxy(server);

describe('ImgProxy', () => {
  it('valid request', () => {
    const url = instance
      .minWidth(50)
      .minHeight(50)
      .url(image);
    expect(url)
      .toBe("http://localhost:3000/path/-/mw:50/mh:50/plain/local:///example.jpg@jpg");
  });
});

export {};
