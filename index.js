const axios = require('axios')
const fs = require('fs')
const colors = require('colors')
const https = require('http')


var success = 0
var fails = 0
var errors = 0


const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/g, '').split('\n');
let working = proxies






function send(result){
  let proxy = proxies[Math.floor(Math.random() * proxies.length)];
  let ip = proxy.split(":")[0]
  let port = proxy.split(":")[1]

  axios.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${result}`, { proxy: { host: ip, port: port } }).then(function(response) {
    if (response.data.code) {
      fs.appendFile(`nitro.txt`, `https://discord.gift/${result}\n`, function(err) {
      })
      success = success + 1
      process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
      console.log(colors.green(`[SUCCESS] https://discord.gift/${result} | Proxy: ${ip}:${port}`))
    }
  }).catch(err => {
    if (err.response) {
      if (err.response.status === 429) {
        console.log(colors.yellow(`[RATE LIMITED] https://discord.gift/${result} | Proxy: ${ip}:${port} | ${err.response.status}`))
        errors = errors + 1
        send(result)
      }
      else if (err.response.status === 404) {
        fs.appendFile(`nitro_fail.txt`, `https://discord.gift/${result} - ${err.response.status}\n`, function(err) {
        })
        fails = fails + 1
        process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
        console.log(colors.red(`[FAIL] https://discord.gift/${result} | Proxy: ${ip}:${port} | ${err.response.status}`))
      } else {
        fs.appendFile(`nitro_fail.txt`, `https://discord.gift/${result} - ${err.response.status}\n`, function(err) {
        })
        errors = errors + 1
      }
    } else {
      if (err.code !== "ECONNREFUSED") return;
      console.log(colors.bgRed(err.code + " with the proxy " + err.address + ":" + err.port))
      working.splice(working.indexOf(`${err.address}:${err.port}`), 1)
      //fs.appendFile("inv_proxies.txt", `${err.address}:${err.port}\n`, "utf8", (err) => err ? console.error(err) : "")
      errors = errors + 1
      send(result);
      process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
    }
  })
}



async function gerar() {

  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = ""
  for (var a = 0; a < 16; a++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }


  send(result)

}

console.clear()

console.log(colors.cyan(`[NITRO GENERATOR] Started\n`))


https.createServer({}, (req, res) => {
  res.writeHead(200);
  res.end('Hello, world!');
}).listen(80);

setInterval(() => {
  gerar()
}, 2000);


function exit(code) {
  //fs.writeFileSync("./proxies/" + new Date().getTime() + "=" + Math.round(process.uptime()) + ".txt", working.join("\n"), "utf8", (err) => err ? console.error(error) : null)
  fs.writeFileSync("proxies.txt", working.join("\n"), "utf8", (err) => err ? console.error(error) : null)
  process.exit(code)
}
process.on('SIGTERM', exit)
//process.on('SIGKILL', exit)
process.on('SIGINT', exit)
process.on('uncaughtException', exit)
//process.on('exit', exit)
process.on("uncaughtExceptionMonitor", exit)
process.on("unhandledRejection", exit)
process.on("uncaughtException", exit)
