'***************************************************************************************************************************************'
Sub Main()
'***************************************************************************************************************************************'

    rs = CreateObject("roRegistrySection", "html")
    mp = rs.read("mp")
    if mp <> "1" then
        rs.write("mp","1")
        rs.flush()
        RebootSystem()
    endif

    msgPort = CreateObject("roMessagePort")

    ' configure and create node / htmlWidget
    ' r = CreateObject("roRectangle", 0,0,1920,1080)
    r = CreateObject("roRectangle", 0,0,4096,2160)

    aa = {}
    aa.AddReplace("nodejs_enabled",true)
    aa.AddReplace("brightsign_js_objects_enabled",true)
    aa.AddReplace("url","file:///sd:/autorun.html")

    is = CreateObject("roassociativearray")
    is.AddReplace("port",3000)

    aa.AddReplace("inspector_server",is)

    htmlWidget = CreateObject("roHtmlWidget", r, aa)
    htmlWidget.SetPort(msgPort)
    htmlWidget.show()

    ' get ip address
    nc = CreateObject("roNetworkConfiguration", 0)
    networkConfig = nc.GetCurrentConfig()
    ipAddress$ = networkConfig.ip4_address
    print "ipAddress = ";ipAddress$

    ' send IP address via message port
''    aa = {}
''    aa.AddReplace("command", "setIPAddress")
''    aa.AddReplace("value", ipAddress$)
''    htmlWidget.PostJSMessage(aa)

    while true
        event = wait(0, msgPort)
        print type(event)

        if type(event) = "roHtmlWidgetEvent" then
            eventData = event.GetData()
            print type(eventData)
        	if type(eventData) = "roAssociativeArray" and type(eventData.reason) = "roString" then
                print "reason = " + eventData.reason
                if eventData.reason = "load-finished" then
                    ' send IP address via message port
                    aa = {}
                    aa.AddReplace("command", "setIPAddress")
                    aa.AddReplace("value", ipAddress$)
                    htmlWidget.PostJSMessage(aa)
                endif
            endif
        endif
    end while

End Sub
