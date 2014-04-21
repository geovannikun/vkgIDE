function vkgIDE(window, editorElement, archivesElement){
    var self = this;
    this.window = window;
    this.editor;
    this.projects = [];
    this.projectOpen;
    this.fileOpen;
    this.fileOpened = new Array();
    this.projectsJson;
    this.editorElement = editorElement;
    this.archivesElement = archivesElement;
    this.start = function(){
        self.editor = CodeMirror(
            self.editorElement,
            {
                value: "Wellcome",
                mode:  "none",
                lineNumbers: true,
                extraKeys: self.keyBinding,
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
        self.editor.focus();
        self.editor.on("focus",disablePopups);
    }
    this.loadProjects = function(){
        self.projectsJson = eval(readFile('./projects.json'));
        console.log(self.projectsJson);
        document.getElementById("projects").innerHTML="<li class='newProject' onclick='dialogOpen()'>New Project...</li>";
        for(var i=0,j=self.projectsJson.length;i<j;i++){
            self.projects.push(new Project(self.projectsJson[i].name, self.projectsJson[i].folder, self.projectsJson[i].type));
            document.getElementById("projects").innerHTML+="<li onclick='ide.selectProject("+i+")'>"+self.projectsJson[i].name+"</li>";
        }
    }
    this.selectProject = function(project){
        self.projectOpen = self.projects[project];
        self.projectOpen.showArchives(self.archivesElement);
    }
    this.addProject = function(name,folder,type){
        self.projectsJson = eval(readFile('./projects.json'));
        fs.writeFile(
            "content/projects.json",
            JSON.stringify(
                self.projectsJson.concat(
                    {"name":name,"folder":folder,"type":type}
                )
            ), "utf8" , function(){} );
        console.log(self.projectsJson);
        self.loadProjects();
    }
    this.changeTitle = function(title){
        document.title = title + " - vkgIDE";
        self.window.title = title + " - vkgIDE";
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
            self.fileOpen.save(cm.getValue());
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