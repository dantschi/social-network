// const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

module.exports.getOgDetails2 = function getOgDetails2(url, cb) {
    var data = "";

    https
        .get(url, resp => {
            // A chunk of data has been recieved.
            resp.on("data", chunk => {
                data += Buffer.from(chunk);
                // console.log("resp chunk", data);
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                if (resp.statusCode != 200) {
                    cb(new Error(resp.statusCode));
                } else {
                    var $ = cheerio.load(data);
                    let type = $('meta[property="og:type"]').attr("content");
                    let title = $('meta[property="og:title"]').attr("content");
                    let siteUrl = $('meta[property="og:url"]').attr("content");
                    let desc = $('meta[property="og:description"]').attr(
                        "content"
                    );
                    let name = $('meta[property="og:site_name"]').attr(
                        "content"
                    );
                    let img = $('meta[property="og:img"]').attr("content");
                    console.log("om:type", type);
                    let resObj = {
                        type: type || "external page",
                        title: title || "external page",
                        url: siteUrl || "/",
                        desc:
                            desc ||
                            "This is a link to an external page without og tag.",
                        name: name || "external page",
                        imageurl: img || "./logo.svg"
                    };
                    console.log("getOgDetails resObj", resObj);
                    cb(null, resObj);
                }

                // console.log("response end", data);
                // console.log("title", title, "url", url, "description", desc);
                // let keys = Object.keys(meta);
                //
                // console.log("attribs", Object.keys(meta["0"].attribs));
                // console.log("getOgDetails2 result ogtitle", title);
            });
        })
        .on("error", err => {
            console.log("Error: " + err.message);
        });

    https.end;
};

// module.exports.getOgDetails = async function getOgDetails(url) {
//     try {
//         var type = "";
//         var title = "";
//         var siteUrl = "";
//         var desc = "";
//         var name = "";
//         var img = "";
//         return await axios.get(url).then(result => {
//             console.log("result", Object.keys(result), typeof result.data);
//             const $ = cheerio.load(result.data);
//             // let meta = $("meta");
//             type = $('meta[property="og:type"]').attr("content");
//             title = $('meta[property="og:title"]').attr("content");
//             siteUrl = $('meta[property="og:url"]').attr("content");
//             desc = $('meta[property="og:description"]').attr("content");
//             name = $('meta[property="og:site_name"]').attr("content");
//             img = $('meta[property="og:img"]').attr("content");
//
//             console.log("getOgDetails type", type);
//             console.log("title", title);
//             console.log("url", siteUrl);
//         });
//     } catch (err) {
//         console.log("getOgDetails error: ", err);
//     }
//     return {
//         type: type || "external page",
//         title: title || "external page",
//         url: siteUrl || "/",
//         desc: desc || "This is a link to an external page without og tag.",
//         name: name || "external page",
//         imageurl: img || "./logo.svg"
//     };
// };
