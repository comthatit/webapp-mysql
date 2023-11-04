const express = require('express')
const fs = require('fs')
const qs = require('querystring')
const app = express()
const port = 3000
const template = require('./template.js')
const mysql      = require('mysql2');
const db = mysql.createConnection({
    host     : 'svc.sel5.cloudtype.app',
    user     : 'root',
    password : '1234',
    database : 'sunrin',
    port : 30247
  });
db.connect();

app.get('/', (req, res)=>{
    let {name} = req.query
    db.query('SELECT * from teacher', (err, teacher) => {
        if (err) throw err;
        let list = template.list(teacher)
        let data, control 
        if(name === undefined){
            name = 'sunrin'
            data = 'Welcome'
            control = `<a href="/create">create</a>`
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
            res.send(html)
        }else{
            db.query(`SELECT teacher.id as teacher_id, name, subject, class, room
             from teacher join office on office_no=office.id where teacher.id=?`,
             [name], (err2, teacher2) => {
                if (err2) throw err2;
                name = teacher2[0].name
                data = `과목 : ${teacher2[0].subject}, 학급 : ${teacher2[0].class}, 교무실 : ${teacher2[0].room}`
                control = `<a href="/create">create</a> <a href="/update?name=${teacher2[0].teacher_id}">update</a>
                <form action="delete_process" method="post">  <!-- 링크로 이동하지 않고 바로 삭제 구현 -->
                <input type='hidden' name='id' value='${teacher2[0].teacher_id}'>
                <button type="submit">delete</button>
                </form>
                 `
                 const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
                 res.send(html)  
            })
        }
     });
})
app.get('/create', (req, res)=>{
    db.query('SELECT * from teacher', (err, teacher) => {
        if (err) throw err;
        const name = 'create'
        const list = template.list(teacher)
        const data = template.create()
        const html = template.HTML(name, list, data, '')
        res.send(html)
    })
})
app.get('/update', (req, res)=>{
    let {name} = req.query
    db.query('SELECT * from teacher', (err, teacher) => {
        if (err) throw err;
        let list = template.list(teacher)
        db.query(`SELECT * from teacher where id=?`,[name], (err2, teacher2) => {
            if (err2) throw err2;
            name = teacher2[0].name
            let control = `<a href="/create">create</a> <a href="/update?name=${teacher2[0].id}">update</a>
            <form action="delete_process" method="post">  <!-- 링크로 이동하지 않고 바로 삭제 구현 -->
                <input type='hidden' name='id' value='${teacher2[0].id}'>
                <button type="submit">delete</button>
            </form>
            `
            const data = template.update(teacher2[0].id, name, teacher2[0].subject)
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
            res.send(html)  
        })
    })
})
app.post('/create_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const title = post.title
        const description = post.description
        db.query('insert into teacher (name, subject, created, class, office_no) values (?, ?, now(), ?, ?)',
        [title, description, null, 1], (err, result) => {
            if (err) throw err;
            res.redirect(302, `/?name=${result.insertId}`)
        })
    })
})
app.post('/update_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const id = post.id
        const title = post.title
        const description = post.description
        // fs.rename(`page/${id}`, `page/${title}`, (err)=>{  // 파일명 변경 시 처리
        //     fs.writeFile(`page/${title}`, description, 'utf8', (err)=>{
        //         res.redirect(302, `/?name=${title}`)
        //     })    
        // })
        db.query('update teacher set name=?, subject=? where id=?', [title, description, id], (err, result) => {
            if (err) throw err;
            res.redirect(302, `/?name=${id}`)
        })
    })
})
app.post('/delete_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const id = post.id
        // fs.unlink(`page/${id}`, (err)=>{  // 파일 삭제 처리
        //     res.redirect(302, `/`)  //  삭제 후 홈으로 redirect
        // })
        db.query('delete from teacher where id=?', [id], (err, result) => {
            if (err) throw err;
            res.redirect(302, `/`)
        })
    })
})
app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})