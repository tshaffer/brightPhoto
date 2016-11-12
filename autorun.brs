rs = createobject("roregistrysection", "html")
mp = rs.read("mp")
if mp <> "1" then
    rs.write("mp","1")
    rs.flush()
    RebootSystem()
endif

r=CreateObject("roRectangle", 0,0,1920,1080)
h=CreateObject("roHtmlWidget", r)
h.allowjavascripturls({all:"*"})
h.SetUrl("file:///sd:/autorun.html")
h.StartInspectorServer(3000)
h.Show()

p = CreateObject("roMessagePort")
h.SetPort(p)
while true
msg = wait(100, p)
end while
