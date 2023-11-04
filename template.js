module.exports = {
    HTML: function (name, list, body, control) {
        return `
            <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}</title>
        </head>
        <body>
            <h1><a href="/">선린인터넷고등학교</a></h1>
            <!-- 메뉴 -->
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `
    }, list: function (files) {
        let list = '<ol>'
        for (i = 0; i < files.length; i++) {
            list = list + `<li><a href="/?name=${files[i].id}">${files[i].name}</a></li>`
        }
        list = list + '</ol>'
        return list
    }, create: function() {
        return `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="name"></p>
            <p><textarea name="description" placeholder="subject"></textarea></p>
            <p><button type="submit">Send</button></p>
        </form>
        `
    }, update: function(id, name, content) {
        return `
        <form action="/update_process" method="post">
            <p><input type="hidden" name="id" value="${id}"></p>
            <p><input type="text" name="title" placeholder="title" value="${name}"></p>
            <p><textarea name="description" placeholder="description">${content}</textarea></p>
            <p><button type="submit">Send</button></p>
        </form>
        `
    }
}