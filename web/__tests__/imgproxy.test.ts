import { ImgProxy, ImgProxyServer } from "../src/imgproxy";
import { File } from "@selab-2/groep-1-orm";

const image = {
  id: 0,
  path: "example.jpg",
  mime: "application/jpeg",
  createdAt: new Date(),
  updatedAt: new Date(),
  user_id: 0,
  original_name: "example.jpg",
  size_in_bytes: 1024,
} satisfies File;

const server = new ImgProxyServer("http://localhost:8081");

const instance: ImgProxy = new ImgProxy(server);

describe("ImgProxy", () => {
  it("valid request", () => {
    const url = instance.minWidth(50).minHeight(50).url(image);
    expect(url).toBe(
      "http://localhost:8081/-/mw:50/mh:50/plain/local://images/example.jpg@jpg",
    );
  });
});

export {};
