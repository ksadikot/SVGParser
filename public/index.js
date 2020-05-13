// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {

    //Log panel ajax call
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/allFiles',

        success: function(data) {

            let jString; 

            if (data.jList.length <= 0) { 
                document.getElementById("logTable").style.visibility = "hidden";
                document.getElementById("logLabel").style.visibility = "visible";

            }
            
            for (let i = 0; i < data.jList.length; i++) {
                jString = JSON.parse(data.jList[i]);
                
                addLog(jString, data.sizeArr[i]);

            }

            
        },
        fail: function(error) {
            console.log(error);
        }
    })
 
    //SVGPanel ajax call
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/selectSVG',   //The server endpoint we are connecting to

        success: function (data) {

            for (let i = 0; i < data.fileNames.length; i++) {
                $("#SVGfiles").append($('<option>')
                    .attr('value', data.fileNames[i])
                    .text(data.fileNames[i])
                )
            }
            
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    })

    $('#SVGfiles').change(function(){
        $('div.img-container').find('img')
                .attr('src', $('#SVGfiles').val())

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/svgComponents',
            data: {
                svgFile: $('#SVGfiles').val()
            },

            success: function(data) {

                let jString;
                jString = JSON.parse(data.tAndD);
                let svgTable = document.getElementById('tANDd');
                svgTable.rows[1].cells[0].innerHTML = jString["title"];
                svgTable.rows[1].cells[0].innerHTML += '<br>'
                svgTable.rows[1].cells[0].innerHTML += '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#editTitle">Edit Title</button>';
                svgTable.rows[1].cells[1].innerHTML = jString["description"];
                svgTable.rows[1].cells[1].innerHTML += '<br>'
                svgTable.rows[1].cells[1].innerHTML += '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#editDesc">Edit Description</button>';

                let rectString = JSON.parse(data.rects);
                let circString = JSON.parse(data.circs);
                let pathString = JSON.parse(data.paths);
                let groupString = JSON.parse(data.groups);

                document.getElementById('compBody').innerHTML = '';

                console.log(circString.length);

                for (let r = 0; r < rectString.length; r++) {
                    $("#compTable").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .text("rectangle " + (r + 1))
                        )
                        .append($('<td>')
                            .text("x = " + rectString[r]["x"] + ", y = " + rectString[r]["y"] + ", width = " + rectString[r]["w"] + rectString[r]["units"] + ", height = " + rectString[r]["h"] + rectString[r]["units"])
                            
                        )
                        .append($('<td>')
                            .text(rectString[r]["numAttr"])
                        )
                        
                    )
                }

                for (let c = 0; c < circString.length; c++) {
                    $("#compTable").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .text("Circle " + (c + 1))
                        )
                        .append($('<td>')
                            .text("x = " + circString[c]["cx"] + ", y = " + circString[c]["cy"] + ", radius = " + circString[c]["r"] + circString[c]["units"])
                            
                        )
                        .append($('<td>')
                            .text(circString[c]["numAttr"])
                        )
                        
                    )
                }

                for (let p = 0; p < pathString.length; p++) {
                    $("#compTable").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .text("Path " + (p + 1))
                        )
                        .append($('<td>')
                            .text("path data = " + pathString[p]["d"])
                            
                        )
                        .append($('<td>')
                            .text(pathString[p]["numAttr"])
                        )
                        
                    )
                }

                for (let g = 0; g < groupString.length; g++) {
                    $("#compTable").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .text("Group " + (g + 1))
                        )
                        .append($('<td>')
                            .text(groupString[g]["children"] + " child elements")
                            
                        )
                        .append($('<td>')
                            .text(groupString[g]["numAttr"])
                        )
                        
                    )
                }

            },
            fail: function(error) {
                console.log(error);
            }


        })

         
    })

    $("#enter").click(function(){

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/createSVG',
            data: {
                fileName: $("#svgFileName").val()
            },

            success: function(data) {
               
            },
            fail: function(err) {
                console.log(err);

            }

        })
        

        $("#svgFileName").val("");
    })

    $("#titleEnter").click(function(){

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/editTitle',
            data: {
                newTitle: $("#newTitle").val(),
                fileName: $('#SVGfiles').val()
            },

            success: function(data) {

                jString = JSON.parse(data.title);
                let svgTable = document.getElementById('tANDd');
                svgTable.rows[1].cells[0].innerHTML = jString["title"];
                svgTable.rows[1].cells[0].innerHTML += '<br>'
                svgTable.rows[1].cells[0].innerHTML += '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#editTitle">Edit Title</button>';
                
               
            },
            fail: function(err) {
                console.log(err);

            }

        })
        

        $("#newTitle").val("");
    })

    $("#descEnter").click(function(){

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/editDesc',
            data: {
                newDesc: $("#newDesc").val(),
                fileName: $('#SVGfiles').val()
            },

            success: function(data) {

                jString = JSON.parse(data.title);
                let svgTable = document.getElementById('tANDd');
                svgTable.rows[1].cells[1].innerHTML = jString["description"];
                svgTable.rows[1].cells[1].innerHTML += '<br>'
                svgTable.rows[1].cells[1].innerHTML += '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#editDesc">Edit Description</button>';
                
               
            },
            fail: function(err) {
                console.log(err);

            }

        })
        

        $("#newTitle").val("");
    })

});

//Add svg image to log panel
function addLog(jString, fileSize) {
    
    $("#logTable").find('tbody')
    .append($('<tr>')
        .append($('<td>')
            .append($('<a>')
                    .attr('download', "./uploads/" + jString["fileName"])
                    .attr('href', jString["fileName"]) 
                    .append($('<img>')
                        .attr('src', jString["fileName"]) 
                        .attr('id', "logImg") 
                    )
            )
         )
        .append($('<td>')
            .append($('<a>')
                .attr('download', "./uploads/" + jString["fileName"])
                .attr('href', jString["fileName"])
                .text(jString["fileName"])
            )
        )
        .append($('<td>')
            .text(fileSize+"KB")
        )
        .append($('<td>')
            .text(jString["numRect"])
        )
        .append($('<td>')
            .text(jString["numCirc"])
        )
        .append($('<td>')
            .text(jString["numPaths"])
        )
        .append($('<td>')
            .text(jString["numGroups"])
        )
    )



}