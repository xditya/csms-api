import { Application, Router } from "oak";
import { getOrderByHash, updateOrderStatus } from "./database.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.redirect("https://xditya.me");
});

router.get("/order", async (ctx) => {
  const url = ctx.request.url;
  const searchParams = url.searchParams;

  const email = searchParams.get("email");
  const hash = searchParams.get("hash");

  if (!email || !hash) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing email or hash parameter" };
    return;
  }

  const orderDetails = await getOrderByHash(email, hash);
  let dataToReturn;

  if (orderDetails?.status === "Placed") {
    dataToReturn = {
      error: null,
      hash: orderDetails?.hash,
      items: orderDetails?.items,
      totalCost: orderDetails?.totalCost,
    };
  } else {
    dataToReturn = {
      error: "Order deliverd!",
    };
  }

  if (!orderDetails) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Order not found" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = dataToReturn;
});

router.get("/order/complete", async (ctx) => {
  const url = ctx.request.url;
  const searchParams = url.searchParams;

  const email = searchParams.get("email");
  const hash = searchParams.get("hash");

  if (!email || !hash) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing email or hash parameter" };
    return;
  }

  const orderDetails = await getOrderByHash(email, hash);

  if (!orderDetails) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Order not found" };
    return;
  }

  await updateOrderStatus(email, hash, "Done");

  ctx.response.status = 200;
  ctx.response.body = { status: "success" };
});

const app = new Application();
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => console.log(e));

console.log("> Started listening on PORT 8000!");

await app.listen({ port: 8000 });
