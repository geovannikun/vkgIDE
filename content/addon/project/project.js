function Project(path){
    this.name;
    this.path = path;
    this.type;
    this.folders = [];
    this.files = [];
    var list = fs.readdirSync(this.path);
    var path = this.path;
    var folders = [];
    var files = [];
    list.forEach(function(file) {
        var file = path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){
            folders.push("/"+file.slice(file.lastIndexOf('/')+1, file.length));
        }else{
            files.push(new File(file));
        }
    });
    this.files = files;
    this.folders = folders;
}

function File(path){
    this.name;
    this.path = path;
    this.mimetype = mime.lookup(this.path);
    this.name = this.path.slice(this.path.lastIndexOf('/')+1, this.path.length);
    var path = this.path;
    this.save = function(content){
        fs.writeFile(path, content, function(err) {
            if(err) {
                return false;
            } else {
                return true;
            }
        });
    };
    this.load = function(){
        return fs.readFileSync(path, "utf8");
    };
}

function Folder(){
}