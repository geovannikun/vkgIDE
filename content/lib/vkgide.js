function vkgIDE(window, editorElement, archivesElement){
    this.window = window;
    this.editor;
    this.projects = [];
    this.projectOpen;
    this.fileOpen;
    this.filesOpened = new Array();
    this.projectsJson;
    this.editorElement = editorElement;
    this.archivesElement = archivesElement;
    this.start = function(){
        this.editor = CodeMirror(
            this.editorElement,
            {
                value: "Wellcome",
                mode:  "none",
                lineNumbers: true,
                extraKeys: this.keyBinding,
                styleActiveLine: true,
                matchBrackets: true,
                theme:"ambiance",
                foldGutter: true,
                lineWrapping: true,
                indentWithTabs: false,
                indentUnit: 4,
                tabSize: 4,
                lineWrapping:false,
                showTrailingSpace: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            }
        );
        this.editor.focus();
        this.editor.on("focus",disablePopups);
    }.bind(this);
    this.loadProjects = function(){
        this.projectsJson = eval(readFile('./projects.json'));
        document.getElementById("projects").innerHTML="<li class='newProject' onclick='dialogOpen()'>New Project...</li>";
        for(var i=0,j=this.projectsJson.length;i<j;i++){
            this.projects.push(new Project(this.projectsJson[i].name, this.projectsJson[i].folder, this.projectsJson[i].type, this));
            document.getElementById("projects").innerHTML+="<li onclick='ide.selectProject("+i+")'>"+this.projectsJson[i].name+"</li>";
        }
    }
    this.selectProject = function(project){
        this.projectOpen = this.projects[project];
        this.projectOpen.showArchives(this.archivesElement);
    }
    this.addProject = function(name,folder,type){
        this.projectsJson = eval(readFile('./projects.json'));
        fs.writeFile(
            "content/projects.json",
            JSON.stringify(
                this.projectsJson.concat(
                    {"name":name,"folder":folder,"type":type}
                )
            ), "utf8" , function(){} );
        this.loadProjects();
    }
    this.changeTitle = function(title){
        document.title = title + " - vkgIDE";
        this.window.title = title + " - vkgIDE";
    }
    this.keyBinding = {
        "Ctrl-Space": function(cm) {
            CodeMirror.showHint(cm, CodeMirror.hint.javascript);
        },
        "Ctrl-Q": function(cm){
            cm.foldCode(cm.getCursor());
        },
        "Ctrl-J": function(cm){ 
            cm.autoFormatAll( { line:0 , ch:0 } , { line:cm.lineCount() , ch:0 } ); 
        },
        "Ctrl-O": function(cm){
            window.frame.openDialog({
                type : 'open',
                title : 'Open file',
                multiSelect: false,
                dirSelect : false
            }, function (err, files) {
                if (!err) {
                    console.log(fs);
                    var f = new File(files[0]);
                    document.title = f.name + " - vkgIDE"
                    cm.setValue(f.load());
                    editor.setOption("mode", f.mimetype);
                    editor.refresh();
                    fileOpened = f;
                } else {
                    console.log(err);
                }
            });
        },
        "Ctrl-S": function(cm){
            this.fileOpen.save(cm.getValue());
            console.log("saved");
        },
        "Tab": function(cm) {
            if (cm.somethingSelected()) {
                cm.indentSelection("add");
            } else {
                cm.replaceSelection(cm.getOption("indentWithTabs")? "\t":
                Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
            }
        }
    }
}

function readFile(file){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
      }
    }
    xmlhttp.open("GET",file,false);
    xmlhttp.send();
    return xmlhttp.responseText;
}