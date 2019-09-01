export function GetQueryString (name){
    var after = window.location.hash.split("?")[1];
    //alert(window.location.hash)
    if(after){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = after.match(reg);
        if(r != null)
        {
            return  decodeURIComponent(r[2]);
        }
        else
        {
            return null;
        }
    }
}