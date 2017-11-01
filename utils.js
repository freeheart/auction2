exports.url2json=function(url){
    var obj={};
    var keyvalue=[];
    var key="",value=""; 
    var paraString=url.substring(url.indexOf("?")+1,url.length).split("&");
    for(var i in paraString)
    {
    keyvalue=paraString[i].split("=");
    key=keyvalue[0];
    value=keyvalue[1];
    obj[key]=value; 
    } 
    return obj;
}
exports.pageJ2S=function(objs,strary,pagenum){
    var s=[],p=0;
    for(var i=0;i<objs.length;i++){
        s.push(JSON.stringify(objs[i]));
        p++;
        if(p>=pagenum){
            strary.push('['+s.join(',')+']'); //整页输出
            s=[];
            p=0;
        }
    }
    if(s.length>0)strary.push('['+s.join(',')+']');  //尾页输出
    s=null;
}

exports.fmtDate =function (obj,joinstr){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+joinstr+m.substring(m.length-2,m.length)+joinstr+d.substring(d.length-2,d.length);
}