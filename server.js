const express = require("express");
const OSS = require("ali-oss");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = "8080";
// console.log("npwd", __dirname + "/dist/index.html");
app.use(express.static(__dirname + "/dist"));

// 设置express 支持post请求参数格式支持json   支持application/json
app.use(bodyParser.json());

// 设置 express 支持 post请求参数 默认是application/x-www-form-urlencoded编码格式  app.use(express.urlencoded());
app.use(express.urlencoded());

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: "oss-cn-chengdu",
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: "LTAI5tCiuAAjM8xxxxxxxxxxxxxxx",
  accessKeySecret: "19raiasjg5ayW9p933D7xxxxxxxxxxxxxxxxxx",
  // 填写Bucket名称。
  bucket: "wmx-blog",
});

// 调用listDir函数，通过设置不同的文件前缀列举不同的目标文件。
async function listDir(dir) {
  const result = await client.list({
    prefix: dir,
    // 设置正斜线（/）为文件夹的分隔符。
    delimiter: "/",
  });
  // console.log("result",result);
  // result.prefixes?.forEach(subDir => {
  //   console.log('SubDir: %s', subDir);
  // });
  // result.objects?.forEach(obj => {
  //   console.log('Object: %s', obj.name);
  // });
  return result.objects ? result.objects.slice(1) : [];
}

async function getBlog(filename) {
  try {
    // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
    // 如果指定的本地文件存在会覆盖，不存在则新建。
    // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
    const result = await client.get(filename);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// get();
app.get("/get", async (req, res) => {
  console.log("get test");
  res.send({ code: 1200, msg: "get 请求成功", data: { success: true } });
});

app.get("/getBlogList", async (req, res) => {
  const list = await listDir("mds/");
  console.log("list", list);
  res.send({ code: 1200, msg: "请求博客列表成功", data: list });
});

app.get("/getBlog", async (req, res) => {
  const filename = req.query.filename;
  console.log("filename", filename);
  if (!filename) {
    res.send({
      code: 1400,
      msg: "请求失败！参数有误",
      data: null,
    });
  }
  const result = await getBlog(filename);
  console.log("result", result.content);
  res.send({
    code: 1200,
    msg: "get 请求成功",
    data: result.content.toString("utf-8"),
  });
});

app.get("/api/getBlogList", async (req, res) => {
  const list = await listDir("mds/");
  console.log("list", list);
  res.send({ code: 1200, msg: "请求博客列表成功", data: list });
});

app.get("/api/getBlog", async (req, res) => {
  const filename = req.query.filename;
  console.log("filename", filename);
  if (!filename) {
    res.send({
      code: 1400,
      msg: "请求失败！参数有误",
      data: null,
    });
  }
  const result = await getBlog(filename);
  console.log("result", result.content);
  res.send({
    code: 1200,
    msg: "get 请求成功",
    data: result.content.toString("utf-8"),
  });
});

app.post("/post", async (req, res) => {
  res.send({ code: 1200, msg: "post 请求成功", data: { success: true } });
});

app.get("*", (req, res) => {
  console.log(path.resolve(__dirname, "dist", "index.html"));
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`express 服务器已开启在${port}端口`);
});
