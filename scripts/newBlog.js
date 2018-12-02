const fs = require('fs');

if(process.argv.length != 3) {
    console.log("Usage: npm run new -- \"Post Title\" ");
    process.exit(1);
}

var fname = process.argv[2].replace(/[^a-z0-9]/gi, '_').toLowerCase();

if(fs.existsSync(`./components/blog/${fname}`)) {
    console.error("Post title exists");
    process.exit(1);
}




fs.writeFileSync(`./components/blog/${fname}.md`,
`---
title: ${process.argv[2]}
date: ${new Date().getTime()}
---
## Some Markdown
`
)

const posts = fs.readdirSync("./components/blog")
    .filter((e) => {return e !== "index.js";});


fs.writeFileSync(`./components/blog/index.js`,
`
${posts.map((e) => {
    return `import ${e.split('.')[0]} from './${e}'`
    }).join("\n")
}

export default {
    ${posts.map((e) => {return `${e.split(".")[0]}`;})
        .join(",\n    ")
    }
}
`)
