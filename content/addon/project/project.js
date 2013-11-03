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
            folders.push(new Folder(file));
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
    this.save = function(content){
        fs.writeFile(path, content, function(err) {
            return !err;
        });
    };
    this.load = function(){
        return fs.readFileSync(path, "utf8");
    };
    this.toString = function(){
        return name;
    }
    this.getHTML = function(){
        var list = document.createElement("li");
        var input = document.createElement("input");
        input.type = "radio";
        input.id = this.name;
        var label = document.createElement("label");
        label.for = this.name;
        label.innerHTML = this.name;
        list.appendChild(label);
        list.appendChild(input);
        return list;
    }
}

function Folder(path){
    this.name = path.slice(path.lastIndexOf('/')+1, path.length);
    this.path = path;
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
            folders.push(new Folder(file));
        }else{
            files.push(new File(file));
        }
    });
    this.files = files;
    this.folders = folders;
    this.toString = function(){
        return name;
    }
    this.getHTML = function(){
        var list = document.createElement("li");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.id = this.name;
        var label = document.createElement("label");
        label.for = this.name;
        label.innerHTML = this.name;
        var filet = document.createElement("li");
        files.forEach(function(file){
            filet.appendChild(file.getHTML());
        });
        folders.forEach(function(folder){
            filet.appendChild(folder.getHTML());
        });
        list.appendChild(label);
        list.appendChild(input);
        list.appendChild(filet);
        return list;
    }
}
