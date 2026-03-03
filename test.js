const sleep = async () => new Promise((res,rej) => setTimeout(res, 3000));

setInterval(()=>console.log("Foobar!"), 500);

async function main() {
    console.log("Hello,");
    // await sleep();
    const ts = Date.now();
    while (Date.now() - ts < 3000) { };
    console.log("World!");
}

main();
