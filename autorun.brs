rs = createobject("roregistrysection", "html")
mp = rs.read("mp")
if mp <> "1" then
    rs.write("mp","1")
    rs.flush()
    RebootSystem()
endif

r=CreateObject("roRectangle", 0,0,1920,1080)

aa=createobjecT("roassociativearray")
aa.addreplace("nodejs_enabled",true)
aa.addreplace("brightsign_js_objects_enabled",true)
aa.addreplace("url","file:///sd:/autorun.html")
is = createobjecT("roassociativearray")
is.addreplace("port",3000)
aa.addreplace("inspector_server",is)
h=CreateObject("roHtmlWidget", r, aa)
h.show()

p = CreateObject("roMessagePort")
h.SetPort(p)
while true
msg = wait(100, p)
end while
