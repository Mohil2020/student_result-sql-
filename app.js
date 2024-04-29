var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_result"
})
con.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");


// ----------Front View-----------

app.get('/', function (req, res) {
    res.render("Front");
})

//---------- School login----------------------

app.get('/Sc-log', function (req, res) {
    res.render("Sc-log");
})
app.post('/Sc-log', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var sql = "select * from school where email='" + email + "' and password='" + password + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 1) {
            res.redirect("Sc-home");
        }
        else {
            res.redirect("/Sc-log");
        }
    })
})

//--------- School Home-----------

app.get('/Sc-home', function (req, res) {
    res.render("Sc-home");
})

// -------School Add-Staff-----------
app.get('/Sc-Ad-Staff', function (req, res) {

    var sql = "select distinct stnd from s_div";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var sql = "select distinct sdiv from s_div";
        con.query(sql, function (err, result1) {
            if (err) throw err;
            res.render("Sc-Ad-Staff", { result, result1 });
        })
    })
})

app.post('/Sc-Ad-Staff', function (req, res) {

    var sname = req.body.sname;
    var semail = req.body.semail;
    var spass = req.body.spass;
    var std = req.body.sstd;
    var div = req.body.sdiv;

    var sql = "select * from s_staff where email='" + semail + "'and password='" + spass + "' and stnd='" + std + "'and sdiv='" + div + "'and name='" + sname + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 1) {
            res.redirect("/Sc-Ad-Staff");
        }
        else {
            var sql = "insert into s_staff(name,email,password,stnd,sdiv) values ('" + sname + "','" + semail + "','" + spass + "','" + std + "','" + div + "')";
            con.query(sql, function (err, result1) {
                if (err) throw err;
                res.redirect("/Sc-home");
            })
        }
    })
})

// ------------School Add-Student-----------
app.get('/Sc-Student', function (req, res) {
    var sql = "select distinct stnd from s_div";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var sql = "select distinct sdiv from s_div";
        con.query(sql, function (err, result1) {
            if (err) throw err;
            res.render("Sc-Student", { result, result1 });
        })
    })
})
app.post('/Sc-Student', function (req, res) {
    var sname = req.body.sname;
    var sstd = req.body.sstd;
    var sdiv = req.body.sdiv;
    var sroll = req.body.sroll;
    var sql = "select * from s_student where name='" + sname + "'and stnd='" + sstd + "'and sdiv='" + sdiv + "'and sroll='" + sroll + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length >= 1) {
            res.redirect("/Sc-Student");
        }
        else {
            var sql = "insert into s_student(name,stnd,sdiv,sroll) values ('" + sname + "','" + sstd + "','" + sdiv + "','" + sroll + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.redirect("/Sc-home");
            })
        }
    })
})

// ----------School Standard------------
app.get('/Sc-Std', function (req, res) {
    res.render("Sc-Std");
})

app.post('/Sc-Std', function (req, res) {

    var s = req.body.std;
    var sql = "select * from s_std where stnd='" + s + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length >= 1) {
            res.redirect("/Sc-Std");
        }
        else {
            var sql = "insert into s_std(stnd) values ('" + s + "')";
            con.query(sql, function (err, result, index) {
                if (err) throw err;
                res.redirect("/Sc-home");
            })
        }
    })

});

//----------- School Division------------
app.get('/Sc-Div', function (req, res) {
    var sql = "select * from s_std";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-Div", { result: result });
    })
})
app.post('/Sc-Div', function (req, res) {
    var stnd = req.body.std;
    var sdiv = req.body.div;
    var sql = "select * from s_div where stnd='" + stnd + "' and sdiv='" + sdiv + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length >= 1) {
            res.redirect("/Sc-Div");
        }
        else {
            var sql = "insert into s_div(stnd,sdiv) values ('" + stnd + "','" + sdiv + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.redirect("/Sc-home");
            })
        }
    })
})


// --------School view Student--------
app.get('/Sc-View', function (req, res) {
    var sql = "select * from s_student";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-View", { result });
    })
})

//----- School view Staff---------
app.get('/Sc-Sview', function (req, res) {
    var sql = "select * from s_staff";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-Sview", { result });
    })
})

// -----------Manage Staff---------------
app.get('/Sc-Manage', function (req, res) {
    var sql = "select * from s_staff";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-Manage", { result });
    })
})
app.get('/DeleteStaff/:id', function (req, res) {

    var id = req.params.id;
    var sql = "delete from s_staff where id='" + id + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/Sc-Manage");
    })
})
app.get('/UpdateStaff/:id', function (req, res) {
    var id = req.params.id;
    var query = "select * from s_staff  where id=" + id;
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render("UpdateStaff", { result });
    })
})
app.post('/UpdateStaff/:id', function (req, res) {

    var id = req.params.id;
    var sname = req.body.sname;
    var semail = req.body.semail;
    var spass = req.body.spass;
    var std = req.body.stnd;
    var div = req.body.sdiv;
    var sql = "update s_staff set name='" + sname + "',email='" + semail + "',password='" + spass + "',stnd='" + std + "',sdiv='" + div + "' where id='" + id + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/Sc-Manage");
    })
})

//------ School Student Std and Div wise view-------------
app.get('/Sc-Std-Div', function (req, res) {
    var sql = "select * from s_student order by stnd";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-Std-Div", { result });
    })
})

// -------------School View Result-----------------
app.get('/Sc-ViewResult', function (req, res) {
    var sql = "select * from result";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-ViewResult", { result });
    })
})

//----------------View Result Standard And Div Wise-------------
app.get('/Sc-ViewStd', function (req, res) {
    var sql = "select * from result order by stnd";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-ViewStd", { result });
    })
})

// ---------------Top wise Result-------------
app.get('/Sc-ViewTop', function (req, res) {
    var sql="select * from result";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-ViewTop", { result });
    })
})
app.post('/Sc-ViewTop', function (req, res) {

    var std = req.body.std;
    var div = req.body.div;
    var sql = "select * from result where stnd='" + std + "'and sdiv='" + div + "' order by per desc limit 3";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("Sc-ViewTop3", { result });
    })
})

// --------------------Staff Login-------------------
var temp;
app.get('/S-Login', function (req, res) {
    res.render("S-Login");
})
app.post('/S-Login', function (req, res) {

    var email = req.body.email;
    var pass = req.body.pass;
    var sql = "select * from s_staff where email='" + email + "'and password='" + pass + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 1) {
            temp = result[0].email;
            res.render("S-dashboard");
        }
        else {
            res.redirect("/S-login");
        }
    })
})

// ------------Staff Dashboard-------------

app.get('/S-dashboard', function (req, res) {
    res.render("S-dashboard");
})

//----------- View Student-----------
app.get('/S-View', function (req, res) {
    var sql = "select * from s_staff where email='" + temp + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 1) {
            var sql = "select * from s_student where stnd='" + result[0].stnd + "'and sdiv='" + result[0].sdiv + "'";
            con.query(sql, function (err, result1) {
                if (err) throw err;
                res.render("S-StudentView", { result1 });
            })
        }
        else {
            res.redirect("/S-dashboard");
        }
    })
})

// -----------------Add Result-------------------
app.get('/S-AddResult', function (req, res) {
    var sql = "select * from s_staff where email='" + temp + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length >= 1) {
            var sql = "select distinct stnd,sdiv from s_student where stnd='" + result[0].stnd + "'and sdiv='" + result[0].sdiv + "'";
            con.query(sql, function (err, result1) {
                if (err) throw err;
                if (result1.length == 1) {
                    var sql = "select sroll from s_student where stnd='" + result1[0].stnd + "'and sdiv='" + result1[0].sdiv + "'";
                    con.query(sql, function (err, result2) {
                        if (err) throw err;
                        res.render("S-AddResult", { result1, result2 });
                    })
                }
                else {
                    res.redirect("/S-dashboard");
                }
            })
        }
        else {
            res.redirect("/S-dashboard");
        }
    })

})
app.post('/S-AddResult', function (req, res) {
    var sname = req.body.sname;
    var sdiv = req.body.sdiv;
    var sroll = req.body.sroll;
    var stnd = req.body.stnd;
    var sql = "select * from result where name='" + sname + "'and stnd='" + stnd + "'and sdiv='" + sdiv + "'and roll='" + sroll + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length >= 1) {
            res.redirect("/S-AddResult");
        }
        else {

            var sname = req.body.sname;
            var stnd = req.body.stnd;
            var sdiv = req.body.sdiv;
            var sroll = req.body.sroll;
            var sub1 = req.body.sub1;
            var sub2 = req.body.sub2;
            var sub3 = req.body.sub3;
            var sub4 = req.body.sub4;
            var sub5 = req.body.sub5;
            var total = parseInt(sub1) + parseInt(sub2) + parseInt(sub3) + parseInt(sub4) + parseInt(sub5);
            var per = (total / 5).toFixed(2);
            var max = Math.max(sub1, sub2, sub3, sub4, sub5);
            var min = Math.min(sub1, sub2, sub3, sub4, sub5);
            var cnt = 0;
            if (sub1 >= 33) {
                cnt++;
            }
            if (sub2 >= 33) {
                cnt++;
            }
            if (sub3 >= 33) {
                cnt++;
            }
            if (sub4 >= 33) {
                cnt++;
            }
            if (sub5 >= 33) {
                cnt++;
            }
            if (cnt == 5) {
                var result = "Pass";
            }
            else if (cnt == 3 || cnt == 4) {
                var result = "ATKT";
            }
            else {
                var result = "Fail";
            }
            var g;
            if (90 <= per) {
                g = "A1"
            }
            else if (80 <= per) {
                g = "A2"
            }
            else if (70 <= per) {
                g = "B1"
            }
            else if (60 <= per) {
                g = "B2"
            }
            else if (50 <= per) {
                g = "C1"
            }
            else if (40 <= per) {
                g = "C2"
            }
            else if (35 <= per) {
                g = "D";
            }
            else {
                g = "*"
            }
            var sql = "insert into result(name,stnd,sdiv,roll,s1,s2,s3,s4,s5,total,per,max,min,res,grade) values('" + sname + "','" + stnd + "','" + sdiv + "','" + sroll + "','" + sub1 + "','" + sub2 + "','" + sub3 + "','" + sub4 + "','" + sub5 + "','" + total + "','" + per + "','" + max + "','" + min + "','" + result + "','" + g + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.redirect("/S-dashboard");
            })

        }
    })
})

// -----------View Result----------
app.get('/S-ViewResult', function (req, res) {
    var sql = "select * from s_staff where email='" + temp + "'";
    con.query(sql, function (err, result1) {
        if (err) throw err;
        if (result1.length == 1) {
            var sql = "select * from result where  stnd='" + result1[0].stnd + "'and sdiv='" + result1[0].sdiv + "'";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("S-ViewResult", { result });
            })
        }
        else {
            res.redirect("/S-dashboard");
        }
    })


})

// --------------View Result Student Wise-----------

app.get('/S-ViewResultStu', function (req, res) {
    var sql = "select * from s_staff where email='" + temp + "'";
    con.query(sql, function (err, result1) {
        if (err) throw err;
        if (result1.length == 1) {
            var sql = "select * from result  where  stnd='" + result1[0].stnd + "'and sdiv='" + result1[0].sdiv + "' order by roll";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("S-ViewResultStu", { result });
            })
        }
        else {
            res.redirect("/S-dashboard");
        }
    })
   
})

//---------------- Manage Result---------------
app.get('/S-ManageResult', function (req, res) {
    var sql = "select * from s_staff where email='" + temp + "'";
    con.query(sql, function (err, result1) {
        if (err) throw err;
        if (result1.length == 1) {
            var sql = "select * from result  where  stnd='" + result1[0].stnd + "'and sdiv='" + result1[0].sdiv + "' order by roll";
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("S-ManageResult", { result });
            })
        }
        else {
            res.redirect("/S-dashboard");
        }
    })
})

app.get('/DeleteResult/:id', function (req, res) {

    var id = req.params.id;
    var sql = "delete from result where id='" + id + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/S-ManageResult");
    })
})
app.get('/UpdateResult/:id', function (req, res) {
    var id = req.params.id;
    var query = "select * from result where id=" + id;
    con.query(query, function (error, result, index) {
        if (error) throw error;
        res.render("S-UpdateResult", { result });
    })
})
app.post('/UpdateResult/:id', function (req, res) {
    var id = req.params.id;
    var sname = req.body.sname;
    var stnd = req.body.stnd;
    var sdiv = req.body.sdiv;
    var sroll = req.body.sroll;
    var sub1 = req.body.sub1;
    var sub2 = req.body.sub2;
    var sub3 = req.body.sub3;
    var sub4 = req.body.sub4;
    var sub5 = req.body.sub5;
    var total = parseInt(sub1) + parseInt(sub2) + parseInt(sub3) + parseInt(sub4) + parseInt(sub5);
    var per = (total / 5).toFixed(2);
    var max = Math.max(sub1, sub2, sub3, sub4, sub5);
    var min = Math.min(sub1, sub2, sub3, sub4, sub5);
    var cnt = 0;
    if (sub1 >= 33) {
        cnt++;
    }
    if (sub2 >= 33) {
        cnt++;
    }
    if (sub3 >= 33) {
        cnt++;
    }
    if (sub4 >= 33) {
        cnt++;
    }
    if (sub5 >= 33) {
        cnt++;
    }
    if (cnt == 5) {
        var result = "Pass";
    }
    else if (cnt == 3 || cnt == 4) {
        var result = "ATKT";
    }
    else {
        var result = "Fail";
    }
    var g;
    if (90 <= per) {
        g = "A1"
    }
    else if (80 <= per) {
        g = "A2"
    }
    else if (70 <= per) {
        g = "B1"
    }
    else if (60 <= per) {
        g = "B2"
    }
    else if (50 <= per) {
        g = "C1"
    }
    else if (40 <= per) {
        g = "C2"
    }
    else if (35 <= per) {
        g = "D";
    }
    else {
        g = "*"
    }
    var sql = "update result set name='" + sname + "',stnd='" + stnd + "',sdiv='" + sdiv + "',roll='" + sroll + "',s1='" + sub1 + "',s2='" + sub2 + "',s3='" + sub3 + "',s4='" + sub4 + "',s5='" + sub5 + "',total='" + total + "',per='" + per + "',max='" + max + "',min='" + min + "',res='" + result + "',grade='" + g + "' where id=" + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/S-ManageResult");
    })
})

// ----------------student side -------------------
app.get('/St-Login', function (req, res) {
    sql = "select distinct stnd,sdiv from result";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render("St-Login", { result });
    })
})
app.post('/St-Login', function (req, res) {
    var stnd = req.body.stnd;
    var sdiv = req.body.sdiv;
    var roll = req.body.roll;
    console.log(stnd, sdiv, roll);
    var sql = "select * from result where stnd='" + stnd + "'and sdiv='" + sdiv + "'and roll='" + roll + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("St-View", { result });
    })

})
app.listen(3000, () => console.log("server running"));
