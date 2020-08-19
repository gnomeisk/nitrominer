const axios = require('axios')
const fs = require('fs')
const colors = require('colors')

var success = 0
var fails = 0
var errors = 0

async function gerar() {

    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    for (var a = 0; a < 16; a++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/g, '').split('\n');
    let proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var ip = proxy.split(":")[0]
    var port = proxy.split(":")[1]

    axios.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${result}`, { proxy: { host: ip, port: port } }).then(function (response) {
        if(response.data.code) {
            fs.appendFile(`nitro.txt`, `https://discord.gift/${result}\n`, function (err) {
            })
            success = success + 1
            process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
            console.log(colors.green(`[SUCCESS] https://discord.gift/${result} | Proxy: ${ip}:${port}`))
        }
    }).catch(err => {
        if(err.response) {
            if(err.response.status === 404) {
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
            errors = errors + 1
            process.title = `[NITRO GEN] | Success: ${success} | Fails: ${fails} | Errors: ${errors}`
        }
    })

}

console.clear()

console.log(colors.cyan(`[NITRO GENERATOR] Started\n`))

setInterval(() => {
    gerar()
}, 1);
