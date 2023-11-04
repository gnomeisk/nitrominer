const axios = require('axios')
const fs = require('fs')
const colors = require('colors')
const https = require('https')


var success = 0
var fails = 0
var errors = 0


var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/g, '').split('\n');
var working = proxies

async function gerar() {

    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    for (var a = 0; a < 16; a++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }


    let proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var ip = proxy.split(":")[0]
    var port = proxy.split(":")[1]

    axios.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${result}`, { proxy: { host: ip, port: port }}).then(function (response) {
        if(response.data.code) {
            fs.appendFile(`nitro.txt`, `https://discord.gift/${result}\n`, function (err) {
            })
            success = success + 1
            process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
            console.log(colors.green(`[SUCCESS] https://discord.gift/${result} | Proxy: ${ip}:${port}`))
        }
    }).catch(err => {
        if(err.response) {
            if(err.response.status === 429){
              console.log(colors.yellow(`[RATE LIMITED] https://discord.gift/${result} | Proxy: ${ip}:${port} | ${err.response.status}`))
              errors = errors + 1
            }
            else if(err.response.status === 404) {
                fs.appendFile(`nitro_fail.txt`, `https://discord.gift/${result} - ${err.response.status}\n`, function (err) {
                })
                fails = fails + 1
                process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
                console.log(colors.red(`[FAIL] https://discord.gift/${result} | Proxy: ${ip}:${port} | ${err.response.status}`))
            } else {
                fs.appendFile(`nitro_fail.txt`, `https://discord.gift/${result} - ${err.response.status}\n`, function (err) {
                })
                errors = errors + 1
            }
        } else {
            console.log(colors.bgRed(err.code + " with the proxy " + err.address + ":" + err.port))
            working.slice(working.indexOf(`${err.address}:${err.port}`), 1)
          fs.appendFile("inv_proxies.txt", `${err.address}:${err.port}\n`, "utf8", (err) => err ? console.error(err) : "")
            errors = errors + 1
            process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
        }
    })

}

console.clear()

console.log(colors.cyan(`[NITRO GENERATOR] Started\n`))


https.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(80);

setInterval(() => {
    gerar()
}, 1000);

process.on('exit', () => {
  fs.writeFileSync(Math.round(process.uptime()) + ".txt", working.join("\n"), "utf8", (err) => err ? console.error(error) : null)
})
