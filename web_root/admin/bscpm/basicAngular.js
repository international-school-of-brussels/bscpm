angular.module("dashboard",['googlechart']).
config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        //allow blog in href
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]).

filter("decode",function(){
    return function(value,data){
        for(let i=0;i<data.length;i++){
            if(value==data[i].value){
                return data[i].name;
            }
        }
        return value;
    };
}).
filter("percent",function(){
    return function(value,showPercentage){
        if(showPercentage){
            return Math.round(value*100,2)+"%";
        }else{
            return value;
        }
    };
}).
controller("dashboardCtrl",["$http","$scope","$q",function($http,$scope,$q){
    $scope.ethnicity=[
        {"name":"Hispanic","value":"11"},
        {"name":"American Indian or Alaskan Native","value":"12"},
        {"name":"Asian","value":"13"},
        {"name":"Black or African American","value":"14"},
        {"name":"Native Hawaiin/Pacific Islander","value":"15"},
        {"name":"White","value":"16"},
        {"name":"Multiple","value":"17"}
    ];
    $scope.pqlist=[
    ];
    //Only allow certain person and only at the district level
    $scope.allowGlobal=isDistrict&&userId==2330?true:false;
    var district=isDistrict;
    var chartDefault={
        type:"ColumnChart",
        data:{
            cols:[],
            rows:[]
        },
        options:{}
    };
    var filterTable="U_d87dashboardSavedFilters";
    $scope.currentSelection=[];
    $scope.charts={
        "iep":{
            "field":"iep",
            "data":null,
            "dataDefault":function(values){
                var defaultData={};
                var subset=0;
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=subset;
                }
                return defaultData;
            },
            total:null,
            totalDefault:0,
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"t",label:"Total",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            options:{
                title: "Individual Education Plan",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: 'none' ,
                tooltip: {isHtml: true}
            },
            chartData:angular.copy(chartDefault)
        },
        "lep":{
            "field":"lep",
            "data":null,
            "dataDefault":function(values){
                var defaultData={};
                var subset=0;
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=subset;
                }
                return defaultData;
            },
            total:null,
            totalDefault:0,
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"value",label:"Total",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            options:{
                title: "Limited English Profiency",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: 'none' 
            },
            chartData:angular.copy(chartDefault)
        },
        "values":{
            "field":"value",
            "data":null,
            "dataDefault":function(values){
                var defaultData={};
                var subset=0;
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=subset;
                }
                return defaultData;
            },
            total:null,
            totalDefault:0,
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"t",label:"Total",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            options:{
                title: "Grades",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: 'none' ,
                tooltip: {isHtml: true}
            },
            chartData:angular.copy(chartDefault)
        },
        "gender":{
            "field":"gender",
            "data":null,
            "dataDefault":function(values){
                var defaultData={};
                var subset={"F":0,"M":0};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=angular.copy(subset);
                }
                return defaultData;
            },
            total:null,
            totalDefault:{
                "F":0,
                "M":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"F",label:"Female",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"M",label:"Male",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            options:{
                title: "Gender",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"}
            },
            chartData:angular.copy(chartDefault)
        
        },
        "lii":{
            "field":"lii",
            "data":null,
            "dataDefault":function(values){
                var defaultData={};
                var subset=0;
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=subset;
                }
                return defaultData;
            },
            total:null,
            totalDefault:0,
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"t",label:"Total",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            options:{
                title: "Low Income",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: 'none' ,
                tooltip: {isHtml: true}
            },
            chartData:angular.copy(chartDefault)
        },
        "department":{
            "field":"department",
            "data":{},
            "total":{},
            cols:[
                {id:"g",label:"Grade",type:"string"}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={};
                }
                return defaultData;
            },
            options:{
                title: "Departments",
                bar: {groupWidth: "95%"},
                height: 400,
                minWidth:1000
            },
            chartData:angular.copy(chartDefault)
        },
        "ethnicity":{
            "field":"ethnicity",
            "data":{},
            "total":{},
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"0",label:"No Ethnicity",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"11",label:"Hispanic",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"12",label:"American Indian or Alaskan Native",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"13",label:"Asian",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"14",label:"Black or African American",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"15",label:"Native Hawaiin/Pacific Islander",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"16",label:"White",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"17",label:"Multiple",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                var subset={
                    "0":0,
                    "11":0,
                    "12":0,
                    "13":0,
                    "14":0,
                    "15":0,
                    "16":0,
                    "17":0
                };
                var v={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]=angular.copy(subset);
                }
                return defaultData;
            },
            "totalDefault":{
                "0":0,
                "11":0,
                "12":0,
                "13":0,
                "14":0,
                "15":0,
                "16":0,
                "17":0
            },
            options:{
                title: "Ethnicity",
                height: 400,
                minWidth:1200,
                bar: {groupWidth: "90%"}
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            translation:function(value){
                switch(value){
                    case "0":
                        return "No Ethnicity";
                    case "11":
                        return "Hispanic";
                    case "12":
                        return "American Indian or Alaskan Native";
                    case "13":
                        return "Asian";
                    case "14":
                        return "Black or African American";
                    case "15":
                        return "Native Hawaiin/Pacific Islander";
                    case "16":
                        return "White";
                    case "17":
                        return "Multiple";
                    default:
                        return value;
                }
            }
        },
        "sender":{
            "field":"senderSchool",
            "data":{},
            "total":{},
            cols:[
                {id:"g",label:"Grade",type:"string"}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={};
                }
                return defaultData;
            },
            options:{
                title: "Sender School",
                height: 400,
                minWidth:1000,
                bar: {groupWidth: "95%"}
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            }
        }
    };

    $scope.courses={
        "dataDefault":function(values){
            var defaultData={
                "courseNumber":"",
                "courseName":""
            };
            for(let i=0;i<values.length;i++){
                defaultData[values[i]]=0;
            }
            return defaultData;
        },
        cols:[
            {
                "columnName":"Course Number",
                "field":"courseNumber"
            },
            {
                "columnName":"Course Name",
                "field":"courseName"
            },
            {
                "columnName":"1",
                "field":"1"
            },
            {
                "columnName":"2",
                "field":"2"
            },
            {
                "columnName":"3",
                "field":"3"
            },
            {
                "columnName":"4",
                "field":"4"
            },
            {
                "columnName":"5",
                "field":"5"
            }
        ],
        data:{},
        "sortOrder":"courseName",
        "reverse":false
    };
    $scope.teachers={
        "dataDefault":function(values){
            var defaultData={
                "teacherFirst":"",
                "teacherLast":""
            };
            for(let i=0;i<values.length;i++){
                defaultData[values[i]]=0;
            }
            return defaultData;
        },
        cols:[
            {
                "columnName":"Teacher Last Name",
                "field":"teacherLast"
            },
            {
                "columnName":"Teacher First Name",
                "field":"teacherFirst"
            },
            {
                "columnName":"1",
                "field":"1"
            },
            {
                "columnName":"2",
                "field":"2"
            },
            {
                "columnName":"3",
                "field":"3"
            },
            {
                "columnName":"4",
                "field":"4"
            },
            {
                "columnName":"5",
                "field":"5"
            }
        ],
        data:{},
        "sortOrder":"teacherLast",
        "reverse":false
    };
    $scope.departments={
        defaultChart:{
            "field":"school",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            titleTranslation:function(value){
                return "Department "+value;
            }
        },
        "charts":{
            
        }
    };
    
    $scope.ethnicity={
        defaultChart:{
            "field":"school",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            titleTranslation:function(value){
                switch(value){
                    case "0":
                        return "No Ethnicity";
                    case "11":
                        return "Hispanic";
                    case "12":
                        return "American Indian or Alaskan Native";
                    case "13":
                        return "Asian";
                    case "14":
                        return "Black or African American";
                    case "15":
                        return "Native Hawaiin/Pacific Islander";
                    case "16":
                        return "White";
                    case "17":
                        return "Multiple";
                    default:
                        return value;
                }
            }
        },
        "charts":{
            
        }
    };
    
    $scope.demographics={
        "iep":{
            "field":"iep",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "Individual Education Plan",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        },
        "lep":{
            "field":"lep",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "Limited English Profiency",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        },
        "lii":{
            "field":"lii",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "Low Income",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        },
        "values":{
            "field":"value",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: " ",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        },
        "f":{
            "field":"value",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "Female",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        },
        "m":{
            "field":"value",
            "data":{},
            "total":{
                "Glenbard East High School":0,
                "Glenbard North High School":0,
                "Glenbard West High School":0,
                "Glenbard South High School":0
            },
            cols:[
                {id:"g",label:"Grade",type:"string"},
                {id:"Glenbard East High School",label:"GBE",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard North High School",label:"GBN",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard West High School",label:"GBW",type:"number"},
                {type: 'string', role: 'tooltip'},
                {id:"Glenbard South High School",label:"GBS",type:"number"},
                {type: 'string', role: 'tooltip'}
            ],
            "dataDefault":function(values){
                var defaultData={};
                for(let i=0;i<values.length;i++){
                    defaultData[values[i]]={
                        "Glenbard East High School":0,
                        "Glenbard North High School":0,
                        "Glenbard West High School":0,
                        "Glenbard South High School":0
                    };
                }
                return defaultData;
            },
            options:{
                title: "Male",
                height: 400,
                width:600,
                colors:["#dc3912","#ff9900","#109618","#3366cc"]
            },
            chartData:{
                type:"ColumnChart",
                data:{
                    cols:[],
                    rows:[]
                },
                options:{}
            },
            "chartOption":{
                
            }
        }
    };
    $scope.currentPage=0;
    $scope.lastPage=null;
    $scope.pageSize=50;
    $scope.currentRows=null;
    $scope.pageList=[
        2,
        10,
        20,
        50,
        100
    ];
    $scope.tab="charts";
    $scope.filters=[];
    $scope.savedFilters=[];
    $scope.pq=null;
    $scope.data=[];
    $scope.additionalParameters=null;
    $scope.loading=false;
    $scope.filteredData=[];
    $scope.filterLoading=false;
    $scope.sortOrder=null;
    $scope.reverse=null;
    $scope.parameters=null;
    $scope.genericFilter="";
    $scope.filterOptions=null;
    $scope.downloadBtn={
        href:null,
        name:"Download",
        show:false
    };
    $scope.values=[];
    $scope.headers=[];
    $scope.valueName="";
    $scope.selectedFilter=null;
    $scope.showPercentages=false;
    $scope.showCourses=false;
    $scope.showTeachers=false;
    $scope.showCurrentSelection=false;
    $scope.filterCurrentSelection=false;
    //filteredData watch
    $scope.$watch(function(){
        return $scope.filteredData;
    },function(old,n){
        let selection=[];
        
        for(let i=0;i<$scope.filteredData.length;i++){
            selection.push($scope.filteredData[i].studentsId);
        }
        selection=unique(selection);
        $scope.currentSelection=selection;
    });
    //Load Raw Data
    $scope.loadData=function(){
        $scope.showCurrentSelection=false;
        $scope.filterCurrentSelection=false;
        $scope.loading=true;
        $scope.data=[];
        var parameters={};
        for(let i=0;i<$scope.additionalParameters.length;i++){
            let value="";
            if($scope.additionalParameters[i].valueProccessing!==undefined){
                value=$scope.additionalParameters[i].valueProccessing($scope.additionalParameters[i].value);
            }else{
                value=$scope.additionalParameters[i].value;
            }
            parameters[$scope.additionalParameters[i].name]=value;
        }
        var query=postParameter(parameters);
        let options={
            "headers":{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        angular.element("#reportName").html($scope.pq.name);
        $http.post($scope.pq.dataSet,query,options).then(function(data){
            for(key in data.data.data[0]){
                if(key=="studentsDcid"){
                    $scope.showCurrentSelection=true;
                    break;
                }
            }
            $scope.filters=[];
            $scope.genericFilter=null;
            $scope.charts.values.options.title=data.data.valueName;
            $scope.valueName=data.data.valueName;
            data.data.data.pop();
            data.data.values.pop();
            $scope.filterOptions=data.data.filters;
            for(let i=0;i<$scope.filterOptions.length;i++){
                if($scope.filterOptions[i].type===undefined){
                    $scope.filterOptions[i]["type"]="string";
                }
            }
            $scope.headers=data.data.header;
            let recordData=data.data.data;
            $scope.values=data.data.values;
            if(data.data.totalRecords>50000){
                let numberOfPages=Math.trunc(data.data.totalRecords/50000);
                if(data.data.totalRecords%50000>0){
                    numberOfPages++;
                }
                let promises=[];
                for(let i=2;i<=numberOfPages;i++){
                    promises.push($http.post($scope.pq.dataSet,query+"&page="+i,options).then(function(d){
                        d.data.pop();
                        recordData=recordData.concat(d.data);
                    }));
                }
                $q.all(promises).then(function(p){
                    $scope.data=recordData;
                    $scope.loading=false;
                });
                
            }else{
                $scope.data=recordData;
                $scope.loading=false;
            }
            for(let chart in $scope.charts){
                $scope.charts[chart].cols[0].label=$scope.valueName;
            }
        },function(){
            alert("There was an error loading data. Please put in a WHD ticket.");
            $scope.loading=false;
        });
    };
    function unique(array) {
        return $j.grep(array, function(el, index) {
            return index == $j.inArray(el, array);
        });
    }
    //Process calculated Totals and create chart data for the general charts
    var loadCharts=function(){
        for(let sets in $scope.charts){
            $scope.charts[sets].chartData.data.cols=angular.copy( $scope.charts[sets].cols);
            let width=600;
            if($scope.charts[sets].options.minWidth!==undefined){
                width=$scope.charts[sets].options.minWidth;
            }
            let cols=parseInt(($scope.charts[sets].cols.length-1)/2);
            let perdept=40;
            $scope.charts[sets].chartData.options=angular.copy($scope.charts[sets].options);
            $scope.charts[sets].chartData.options.width=cols*perdept+100<width?width:perdept*cols+100;
            
            if($scope.showPercentages){
                $scope.charts[sets].chartData.options['vAxis']= { 
                    viewWindowMode:'explicit',
                    viewWindow: {
                        max:1,
                        min:0
                    },
                    format:'###.##%'
                } ;
                
            }
            
            $scope.charts[sets].chartData.data.rows=[];
            var i=0;
            for(let grade in $scope.charts[sets].data){
                if(typeof( $scope.charts[sets].data[grade])=='object'){
                    var row={c:[]};
                    var label="";
                    if(typeof($scope.charts[sets].translation)=="function"){
                        label=$scope.charts[sets].translation(grade);
                    }else{
                        label=grade;
                    }
                    row.c.push({v:label});
                    for(let name in $scope.charts[sets].data[grade]){
                        if($scope.showPercentages){
                            var percent;
                            var tooltip="";
                            switch(sets){
                                case "gender":
                                    percent=( $scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name]);
                                    break;
                                case "sender":
                                case "ethnicity":
                                case "department":
                                    percent=( $scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name]);
                                    break;
                                default:
                                    percent=( $scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name]);
                            }
                            
                            row.c.push({v: percent});
                            row.c.push({v:Math.round(10000*percent,4)/100+"%/"+$scope.charts[sets].data[grade][name]+" Total"});
                        }else{
                            row.c.push({v: $scope.charts[sets].data[grade][name]});
                            var percent;
                            var tooltip="";
                            switch(sets){
                                case "gender":
                                    percent=( $scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name]);
                                    tooltip= $scope.charts[sets].data[grade][name]+" "+$scope.valueName+" "+Math.round(10000*percent,4)/100+"% of "+name+"s";
                                    break;
                                case "sender":
                                case "ethnicity":
                                case "department":
                                    percent= $scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name];
                                    if($scope.charts[sets].translation===undefined){
                                        label=name;
                                    }else{
                                        label=$scope.charts[sets].translation(name);
                                    }
                                    tooltip= $scope.charts[sets].data[grade][name]+" "+$scope.valueName+" "+Math.round(10000*percent,4)/100+"% of "+label+" "+$scope.valueName;
                                    break;
                                default:
                                    percent=$scope.charts[sets].data[grade][name]/ $scope.charts[sets].total[name];
                                    tooltip= $scope.charts[sets].data[grade][name]+" "+$scope.valueName+" "+Math.round(10000*percent,4)/100+"% of "+ $scope.charts[sets].cols[i].label+"s";
                            }
                            row.c.push({v:tooltip});
                        }
                        
                        i++;
                        
                    }
                    $scope.charts[sets].chartData.data.rows.push(row);
                }else{
                    let percent= $scope.charts[sets].data[grade]/ $scope.charts[sets].total;
                    if($scope.showPercentages){
                        $scope.charts[sets].chartData.data.rows.push({c:[
                            {v:grade},
                            {v: ( $scope.charts[sets].data[grade]/ $scope.charts[sets].total)},
                            {v: Math.round(10000*percent,4)/100+"% / "+$scope.charts[sets].data[grade]+" Total"}]});
                        
                    }else{
                        
                        $scope.charts[sets].chartData.data.rows.push({c:[
                            {v:grade},
                            {v: $scope.charts[sets].data[grade]},
                            {v: $scope.charts[sets].data[grade]+" "+$scope.valueName+" "+Math.round(10000*percent,4)/100+"%"}]});
                    }
                }
            }
        }
    };
    //Process calculated Totals and create charts with schools seperated
    var loadSchoolChart=function(charts){
        if(!district){
            return;
        }
        for(let sets in charts){
            charts[sets].chartData.data.cols=angular.copy( charts[sets].cols);
            
            charts[sets].chartData.options=angular.copy(charts[sets].options);
            charts[sets].chartData.data.rows=[];
            
            if(charts[sets].options.title==="" || charts[sets].options.title===undefined){
                if(typeof(charts[sets].titleTranslation)=='function'){
                    charts[sets].chartData.options.title=charts[sets].titleTranslation(sets)
                }else{
                    charts[sets].chartData.options.title=sets;
                }
            }
            if($scope.showPercentages){
                charts[sets].chartData.options['vAxis']= { 
                    viewWindowMode:'explicit',
                    viewWindow: {
                      max:1,
                      min:0
                    },
                    format:'#,###%'} ;
                
            }
            
            
            var i=0;
            for(let grade in charts[sets].data){
                var row={c:[]};
                var label="";
                if(typeof(charts[sets].translation)=="function"){
                    label=charts[sets].translation(grade);
                }else{
                    label=grade;
                }
                if($scope.showPercentages){
                    row.c.push({v:label});
                    for(let school in charts[sets].data[grade]){
                        var percent;
                        var tooltip="";
                        percent=charts[sets].data[grade][school]/ charts[sets].total[school];
                        row.c.push({v: percent});
                        row.c.push({v: Math.round(10000*percent,4)/100+"% / "+charts[sets].data[grade][school]+" Total"});
                    }
                    charts[sets].chartData.data.rows.push(row);
                }else{
                    row.c.push({v:label});
                    for(let school in charts[sets].data[grade]){
                        row.c.push({v: charts[sets].data[grade][school]});
                        var percent;
                        var tooltip="";
                        percent=charts[sets].data[grade][school]/ charts[sets].total[school];
                        if(charts[sets].translation===undefined){
                            label=school;
                        }else{
                            label=charts[sets].translation(school);
                        }
                        tooltip= charts[sets].data[grade][school]+" "+$scope.valueName+" "+Math.round(10000*percent,4)/100+"% of "+label+" "+$scope.valueName;
                        row.c.push({v:tooltip});
                    }
                    charts[sets].chartData.data.rows.push(row);
                    
                }
                
            }
        }
    };
    //Rerun data processing
    $scope.resetData=function(){
        var currentlyLoading="";
        if($scope.loading){
            currentlyLoading=true;
        }else{
            $scope.loading=true;
            currentlyLoading=false;
        }
        //reset defaults
        $scope.currentPage=0;
        $scope.currentRows=$scope.filteredData.slice($scope.currentPage*$scope.pageSize,($scope.currentPage+1)*$scope.pageSize);
        $scope.lastPage=parseInt($scope.filteredData.length/$scope.pageSize)+1;
        calcTotals($scope.filteredData);
        loadCharts();
        loadSchoolChart($scope.departments.charts);
        loadSchoolChart($scope.demographics);
        loadSchoolChart($scope.ethnicity.charts);
        downloadFile();
        if(!currentlyLoading){
            $scope.loading=false;
        }
    };
    //Show tabs
    $scope.showTab=function(tab){
        return $scope.filteredData.length && $scope.tab==tab?true:false;
    };
    //Sort data column
    $scope.sortColumn=function(headers,index){
        var heading=headers[index];
        for(var i=0;i<headers.length;i++){
            if(i!=index){
                headers[i].sort=null;   
            }
        }
        $scope.sortOrder=heading.field;
        switch(heading.sort){
            case "desc":
                heading.sort="asc";
                $scope.reverse=true;
                break;
            case "asc":
                heading.sort=null;
                $scope.reverse=null;
                break;
            default:
                heading.sort="desc";
                $scope.reverse=null;
        }
    };
    //Change the sort image
    $scope.sortImage=function(header){
        if(header.sort===undefined){
            return "/images/sort.png";
        }
        switch(header.sort){
            case "desc":
                return "/images/sort-down.png";
            case "asc":
                return "/images/sort-up.png";
            default:
                return "/images/sort.png";
        }
    };
    //Add additional parameters for the dataset
    $scope.loadAdditional=function(){
        $scope.additionalParameters=$scope.pq.additionalQuestions;
    };
    //data watch
    $scope.$watch(function(){
        return $scope.data;
    },function(newValue,oldValue){
       $scope.filteredData=$scope.data;
    });
    //filteredData watch
    $scope.$watch(function(){
        return $scope.filteredData;
    },function(newValue,oldValue){
        var currentlyLoading="";
        if($scope.loading){
            currentlyLoading=true;
        }else{
            $scope.loading=true;
            currentlyLoading=false;
        }
        $scope.currentPage=0;
        if(newValue.length>0){
            $scope.currentRows=$scope.filteredData.slice($scope.currentPage*$scope.pageSize,($scope.currentPage+1)*$scope.pageSize);
            $scope.lastPage=parseInt($scope.filteredData.length/$scope.pageSize)+1;
            calcTotals($scope.filteredData);
            loadCharts();
            loadSchoolChart($scope.departments.charts);
            loadSchoolChart($scope.demographics);
            loadSchoolChart($scope.ethnicity.charts);
            downloadFile();
            
        }
        if(!currentlyLoading){
            $scope.loading=false;
        }
    });
    //pageSize watch
    $scope.$watch(function(){
        return $scope.pageSize;
    },function(newValue,oldValue){
        $scope.currentRows=$scope.filteredData.slice($scope.currentPage*$scope.pageSize,($scope.currentPage+1)*$scope.pageSize);
        $scope.lastPage=parseInt($scope.filteredData.length/$scope.pageSize)+1;
    });
    
    //currentpage Watch
    $scope.$watch(function(){
        return $scope.currentPage;
    },function(newValue,oldValue){
        $scope.currentRows=$scope.filteredData.slice($scope.currentPage*$scope.pageSize,($scope.currentPage+1)*$scope.pageSize);
    });
    
    $scope.switchTab=function(tab){
        $scope.tab=tab;
    };
    function postParameter(parameters){
        let queryString="";
        for(var name in parameters){
            if(queryString===""){
                queryString=name+"="+parameters[name];
            }else{
                queryString+="&"+name+"="+parameters[name];
            }
        }
        return queryString;
    }
    $scope.setPage=function(action){
        if(action=="next"){
            $scope.currentPage++;            
        }else{
            $scope.currentPage--;
        }
        if($scope.currentPage<0){
            $scope.currentPage=0;
        }
    };
    //Process raw data and create 
    function calcTotals(data){
        //reset charts
        for(var v in $scope.charts){
            $scope.charts[v].data=angular.copy($scope.charts[v].dataDefault($scope.values));
            if( $scope.charts[v].totalDefault===undefined){
                $scope.charts[v].total={};    
            }else{
                $scope.charts[v].total=angular.copy( $scope.charts[v].totalDefault);
            }
        }
        for(let demo in $scope.demographics){
            $scope.demographics[demo].data=angular.copy($scope.demographics[demo].dataDefault($scope.values));
            for(school in $scope.demographics[demo].total){
                $scope.demographics[demo].total[school]=0;
            }
        }
        $scope.teachers.data={};
        $scope.courses.data={};
        $scope.ethnicity.charts={};
        $scope.charts.department.cols=[
            {id:"g",label:$scope.valueName,type:"string"}
        ];
        $scope.charts.sender.cols=[
            {id:"g",label:$scope.valueName,type:"string"}
        ];
        $scope.departments.charts={};
        /** process data
         * Data must contain fields: iep,lep,lii,school,value,gender,ethnicity,sender, value (which the value we are counting)
         **/
        for(var i=0;i<data.length;i++){
            //IEP
            if(data[i].iep){
                $scope.charts.iep.data[data[i].value]++;
                $scope.charts.iep.total++;
                if(district){
                    $scope.demographics.iep.data[data[i].value][data[i].school]++;
                    $scope.demographics.iep.total[data[i].school]++;
                }
            }
            //LEP
            if(data[i].lep){
                $scope.charts.lep.data[data[i].value]++;
                $scope.charts.lep.total++;
                if(district){
                    $scope.demographics.lep.data[data[i].value][data[i].school]++;
                    $scope.demographics.lep.total[data[i].school]++;
                }
            }
            //LII
            if(data[i].lii){
                $scope.charts.lii.data[data[i].value]++;
                $scope.charts.lii.total++;
                if(district){
                    $scope.demographics.lii.data[data[i].value][data[i].school]++;
                    $scope.demographics.lii.total[data[i].school]++;
                }
            }
            //values
            $scope.charts.values.data[data[i].value]++;
            $scope.charts.values.total++;
            
            if(district){
                $scope.demographics.values.data[data[i].value][data[i].school]++;
                $scope.demographics.values.total[data[i].school]++;
            }
            
            //gender
            $scope.charts.gender.data[data[i].value][data[i].gender]++;
            $scope.charts.gender.total[data[i].gender]++;
            
            if(district){
                $scope.demographics[data[i].gender.toLowerCase()].data[data[i].value][data[i].school]++;
                $scope.demographics[data[i].gender.toLowerCase()].total[data[i].school]++;
            }
            
            //ethnicity
            if(data[i].ethnicity=="11"||data[i].ethnicity=="12"||data[i].ethnicity=="13"||data[i].ethnicity=="14"||data[i].ethnicity=="15"
                ||data[i].ethnicity=="16"||data[i].ethnicity=="17"||data[i].ethnicity=="0"){
                $scope.charts.ethnicity.data[data[i].value][data[i].ethnicity]++;
                $scope.charts.ethnicity.total[data[i].ethnicity]++;
                if(district){
                    if($scope.ethnicity.charts[data[i].ethnicity]==undefined){
                        $scope.ethnicity.charts[data[i].ethnicity]=angular.copy($scope.ethnicity.defaultChart);
                        $scope.ethnicity.charts[data[i].ethnicity].data=$scope.ethnicity.charts[data[i].ethnicity].dataDefault($scope.values);
                    }
                    $scope.ethnicity.charts[data[i].ethnicity].data[data[i].value][data[i].school]++;
                    $scope.ethnicity.charts[data[i].ethnicity].total[data[i].school]++;
                }
            }
                
            
            //sender school
            //Create the sender school on the fly
            if($scope.charts.sender.data[data[i].value][data[i].senderSchool]===undefined){
                    for(let k=0;k<$scope.values.length;k++){
                        $scope.charts.sender.data[$scope.values[k]][data[i].senderSchool]=0;
                    }
                    $scope.charts.sender.cols.push({id:data[i].senderSchool,label:data[i].senderSchool,type:"number"});
                    $scope.charts.sender.cols.push({type: 'string', role: 'tooltip'});
                }
                $scope.charts.sender.data[data[i].value][data[i].senderSchool]++;
                if($scope.charts.sender.total[data[i].senderSchool]===undefined){
                    $scope.charts.sender.total[data[i].senderSchool]=0;
                }
                $scope.charts.sender.total[data[i].senderSchool]++;
                
                $scope.charts.sender.total[data[i].senderSchool].total++;
            
            
            
            switch($scope.pq.type){
                case 'grades':
                    //department
                    $scope.showCourses=true;
                    $scope.showTeachers=true;
                    //Create the departments on the fly
                    if($scope.charts.department.data[data[i].value][data[i].department]===undefined){
                        for(let k=0;k<$scope.values.length;k++){
                            $scope.charts.department.data[$scope.values[k]][data[i].department]=0;
                        }
                        $scope.charts.department.cols.push({id:data[i].department,label:data[i].department,type:"number"});
                        $scope.charts.department.cols.push({type: 'string', role: 'tooltip'});
                    }
                    $scope.charts.department.data[data[i].value][data[i].department]++;
                    if($scope.charts.department.total[data[i].department]===undefined){
                        $scope.charts.department.total[data[i].department]=0;
                    }
                    $scope.charts.department.total[data[i].department]++;
                    
                    $scope.charts.department.total[data[i].department].total++;
                    
                    //School/departments
                    //Create the school/departments school on the fly
                    if($scope.departments.charts[data[i].department]==undefined){
                        $scope.departments.charts[data[i].department]=angular.copy($scope.departments.defaultChart);
                        $scope.departments.charts[data[i].department].options.title=data[i].departments;
                        $scope.departments.charts[data[i].department].data=$scope.departments.charts[data[i].department].dataDefault($scope.values)
                    }
                    $scope.departments.charts[data[i].department].data[data[i].value][data[i].school]++;
                    $scope.departments.charts[data[i].department].total[data[i].school]++;
                    //Courses
                    //Create the courses on the fly
                     $scope.courses.cols=[
                        {
                            "columnName":"Course Number",
                            "field":"courseNumber"
                        },
                        {
                            "columnName":"Course Name",
                            "field":"courseName"
                        }
                    ];
                    for(let i=0;i< $scope.values.length;i++){
                        $scope.courses.cols.push({"columnName":$scope.values[i],"field":$scope.values[i]});
                    }
                    if($scope.courses.data[data[i].courseNumber]===undefined){
                        $scope.courses.data[data[i].courseNumber]=$scope.courses.dataDefault($scope.values);
                        $scope.courses.data[data[i].courseNumber].courseNumber=data[i].courseNumber;
                        $scope.courses.data[data[i].courseNumber].courseName=data[i].courseName;
                    }
                    $scope.courses.data[data[i].courseNumber][data[i].value]++;
                    
                    //Teacher
                    //Create the teacher on the fly
                    if($scope.teachers.data[data[i].teacherId]===undefined){
                        $scope.teachers.data[data[i].teacherId]=$scope.teachers.dataDefault($scope.values);
                        $scope.teachers.data[data[i].teacherId].teacherLast=data[i].teacherLast;
                        $scope.teachers.data[data[i].teacherId].teacherFirst=data[i].teacherFirst;
                    }
                    $scope.teachers.data[data[i].teacherId][data[i].value]++;
                    
                    break;
                case "enrollments":
                    //Courses
                    $scope.showCourses=true;
                    $scope.courses.cols=[
                        {
                            "columnName":"Course Number",
                            "field":"courseNumber"
                        },
                        {
                            "columnName":"Course Name",
                            "field":"courseName"
                        },
                        {
                            "columnName":"Not Enrolled",
                            "field":"Not Enrolled"
                        },
                        {
                            "columnName":"Enrolled",
                            "field":"Enrolled"
                        }
                    ];
                    //Create the courses on the fly
                    let courseNumbers=data[i].courseNumbers.split(",");
                    let courseNames=data[i].courseNames===""?["Not Enrolled"]:data[i].courseNames.split(",");
                    for(let j=0;j<courseNumbers.length;j++){
                        if($scope.courses.data[courseNumbers[j]]===undefined){
                            $scope.courses.data[courseNumbers[j]]=$scope.courses.dataDefault($scope.values);
                            $scope.courses.data[courseNumbers[j]].courseNumber=courseNumbers[j];
                            $scope.courses.data[courseNumbers[j]].courseName=courseNames[j];
                        }
                        $scope.courses.data[courseNumbers[j]][data[i].value]++;
                    }
                    
                    break;
                default:
                
                    
            }
            
        }
        
        //After processing Data adjust for percentage view
        if($scope.showPercentages){
            switch($scope.pq.type){
                case "grades":
                     if($scope.showPercentages){
                        //teachers
                        for(teacherId in  $scope.teachers.data){
                            let total=0;
                            for(let value in $scope.teachers.data[teacherId]){
                                total+=typeof($scope.teachers.data[teacherId][value])=='number'?$scope.teachers.data[teacherId][value]:0;
                            }
                            for(let value in $scope.teachers.data[teacherId]){
                                if(typeof($scope.teachers.data[teacherId][value])=='number'){
                                    if(total===0){
                                        $scope.teachers.data[teacherId][value]="0%";
                                    }else{
                                        $scope.teachers.data[teacherId][value]=Math.round(10000*($scope.teachers.data[teacherId][value]/total),4)/100+"%";
                                    }
                                }
                            }
                        }
                        
                        //Courses
                        for(course in  $scope.courses.data){
                            let total=0;
                            for(let value in $scope.courses.data[course]){
                                total+=typeof($scope.courses.data[course][value])=='number'?$scope.courses.data[course][value]:0;
                            }
                            for(let value in $scope.courses.data[course]){
                                if(typeof($scope.courses.data[course][value])=='number'){
                                    if(total===0){
                                        $scope.courses.data[course][value]="0%";
                                    }else{
                                        $scope.courses.data[course][value]=Math.round(10000*($scope.courses.data[course][value]/total),4)/100+"%";
                                    }
                                }
                            }
                        }
                        
                    }
                    break;
                case "enrollments":
                    //Courses
                    for(course in  $scope.courses.data){
                        let total=0;
                        for(let value in $scope.courses.data[course]){
                            if(typeof($scope.courses.data[course][value])=='number'){
                                if(data.length===0){
                                    $scope.courses.data[course][value]="0%";
                                }else{
                                    $scope.courses.data[course][value]=Math.round(10000*($scope.courses.data[course][value]/data.length),4)/100+"%";
                                }
                            }
                        }
                    }
                
                    break;
                
            }
        }
        
    }
    $scope.filter=function(){
        $scope.filterLoading=true;
        var newData=[];
        let adjustedFilters=[];
        for(let i=0;i<$scope.filters.length;i++){
            var f={
                column:$scope.filters[i].column.field,
                query:null,
                multiple:$scope.filters[i].column.allowMultiple===undefined?false:true
            };
            let allStrings=[];
            if(f.multiple){
                $scope.filters[i].value.split(",").forEach(function(a){
                    if(a.trim===undefined){
                        allStrings.push(a);
                    }else{
                        allStrings.push(a.trim());
                    }
                    
                });
            }else{
                allStrings=$scope.filters[i].value.trim!==undefined?[$scope.filters[i].value.trim()]:[$scope.filters[i].value];
            }
            let exp="("+allStrings.join("|")+")";
            switch($scope.filters[i].column.type){
                case "string":
                    let regex;
                    if($scope.filters[i].operator=="notEqual"){
                        regex=new RegExp("^"+exp+"$","i");
                        f.query=function(value){
                            return !regex.test(value);
                        };
                    }else{
                        switch($scope.filters[i].operator){
                            case "contains":
                                regex=new RegExp(exp,"i");

                                break;
                            case "startsWith":
                                regex=new RegExp("^"+exp,"i");

                                break;
                            case "endsWith":
                                regex=new RegExp(exp+"$","i");


                                break;
                            case "=":
                                regex=new RegExp("^"+exp+"$","i");
                                break;
                            case "notEqual":
                                regex=new RegExp("^"+exp+"$","i");
                                break;
                            case "doesNotContain":
                                regex=new RegExp("^((?!("+exp+")).)*$","i");
                                break;
                            default:
                                regex=new RegExp(exp,"i");
                        }
                        f.query=function(value){
                            return regex.test(value);
                        };
                    }
                    break;
                case "number":
                    switch($scope.filters[i].operator){
                        case "=":
                            f.query=function(value){
                                return value==$scope.filters[i].value;
                            };
                            break;
                        case ">":
                            f.query=function(value){
                                return value>$scope.filters[i].value;
                            };
                            break;
                        case "<":
                            f.query=function(value){
                                return value<$scope.filters[i].value;
                            };
                            break;
                        case "<=":
                            f.query=function(value){
                                return value<=$scope.filters[i].value;
                            };
                            break;
                        case ">=":
                            f.query=function(value){
                                return value>=$scope.filters[i].value;
                            };
                            break;
                        case "#":
                            f.query=function(value){
                                return value!=$scope.filters[i].value;
                            };
                            break;
                        default:
                            f.query=function(value){
                                return false;
                            };
                    }
                    break;
                case "boolean":
                    f.query=function(value){
                        for(let i=0;i<allStrings.length;i++){
                            if(value==parseInt(allStrings[i])){
                                return true;
                            }
                        }
                        return false;
                    };
                    break;
                default:
                
            }
            adjustedFilters.push(f);
        }
        for(let i=0;i<$scope.data.length;i++){
            //generic filter
            
            for(let col in $scope.data[i]){
                var valid=false;
                if($scope.genericFilter===null){
                    valid=true;
                }else{
                    switch(typeof($scope.data[i][col])){
                        case "number":
                            if($scope.data[i][col]==$scope.genericFilter){
                                valid=true;
                            }
                            break;
                        case "string":
                            if($scope.data[i][col].toLowerCase().search($scope.genericFilter.toLowerCase())>-1){
                                valid=true;
                            }
                            break;
                        case "date":
                            try{
                                var d=new Date($scope.genericFilter);
                                if(d==$scope.data[i][col]){
                                    valid=true;
                                }
                            }catch(e){
                                
                            }
                            break;
                        case "object":
                            break;
                        default:
                            console.log("error:"+typeof($scope.data[i][col]));
                    }
                    if(valid){
                        break;
                    }
                }
            }
        //Specific filter
            if(valid){
                if(adjustedFilters.length>0){
                    if(testFilter(adjustedFilters,$scope.data[i])){
                        newData.push($scope.data[i]);
                    }
                }else{
                    newData.push($scope.data[i]);
                }
            }
        } 
        let ds=[];
        if($scope.filterCurrentSelection){
            $http.get("currentSelection.json").then(function(data){
                data.data.pop();
                for(let i=0;i<newData.length;i++){
                    if($j.inArray(newData[i].studentsDcid,data.data)!==-1){
                        ds.push(newData[i]);
                    }
                }
                $scope.filteredData=ds;
                $scope.filterLoading=false
            });
        }else{
            $scope.filteredData=newData;
            $scope.filterLoading=false;
        }
        
    };
    function testFilter(filters,value){
        let addRow=true;
        if(filters.length===0){
            return true;   
        }
        for(let j=0;j<filters.length;j++){
            if(!filters[j].query(value[filters[j].column])){
                addRow=false;
                break;
            }
        }
        return addRow;
    }
    $scope.addFilter=function(defaultValues){
        $scope.resetSavedFilter();
        if(defaultValues===undefined){
            $scope.filters.push({
                column:null,
                operator:null,
                value:null
            });
        }else{
            let col=null;
            let value=null;
            for(let i=0;i<$scope.filterOptions.length;i++){
                if($scope.filterOptions[i].field==defaultValues.field){
                    col=$scope.filterOptions[i];
                    
                    break;
                }
            }
            
            $scope.filters.push({
                column:col,
                operator:defaultValues.operator,
                value:defaultValues.value
            });
        }
    };
    $scope.removeFilter=function(index){
        $scope.resetSavedFilter();
        $scope.filters.splice(index,1);
    };
    $scope.filterInput=function(filter){
        var r="text";
        if(filter.column===null){
            return "";
        }
        if(filter.column.options!==undefined){
            r="dropdown";
        }
        if(filter.column.type=="boolean"){
            r="boolean";
        }
        if(filter.column.allowMultiple){
            r="textMutliple";
        }
        return r;
    };
    $scope.resetFilter=function(){
        $scope.genericFilter=null;
        $scope.filters=[]
        $scope.filter();
        $scope.savedFilters=null;
        loadSavedFilters();
    }
    
    $scope.deleteFilter=function(){
        var url="/ws/schema/table/"+filterTable+"/"+$scope.selectedFilter.id;
        if(!$scope.allowFilterDelete()){
            alert('Your are not allowed to delete this filter');
            return;
        }
        let options={
            "method":"DELETE",
            "url":url,
            "headers":{
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
            }
        }
        $http(options).then(function successCallback(response) {
                loadSavedFilters();
            }, function errorCallback(response) {
                alert("Filter was not deleted");
            }
        );
    };
    $scope.allowFilterDelete=function(){
        if($scope.selectedFilter===null){
            return false;
        }
        if($scope.selectedFilter.type==='Global' && $scope.allowGlobal===false){
            return false;
        }
        return true;
    }
    $scope.resetSavedFilter=function(){
        $scope.selectedFilter=null;
    };
    var loadSavedFilters=function(){
        let url="savedFilters.json";
        $http.get(url).then(function successCallBack(data){
            data.data.pop();
            $scope.savedFilters=data.data;
        },function errorCallback(response){
            alert("saved Filters did not load");
        })
    }
    $scope.loadFilters=function(){
        if($scope.selectedFilter===null){
            return;
        }
        let name=$scope.selectedFilter.name;
        if(confirm("Would you like to load "+name+"?")){
            $scope.genericFilter=$scope.selectedFilter.filters.basic;
            let filter=[];
            for(let i=0;i<$scope.selectedFilter.filters.advanced.length;i++){
                for(let j=0;j<$scope.filterOptions.length;j++){
                    if($scope.selectedFilter.filters.advanced[i].field==$scope.filterOptions[j].field){
                       let addFilter=angular.copy(angular.copy($scope.selectedFilter.filters.advanced[i]));
                       addFilter.column=$scope.filterOptions[j];
                       filter.push(addFilter);
                       break;
                    }
                }
            }
            $scope.filters=filter;
            $scope.filter();
        }
    };
    $scope.saveFilters=function(global){
        if(global===undefined){
            global=false;
        }
        let teacherId;
        if(global){
            teacherId=0;
        }else{
            teacherId=userId;
        }
        let name="";
        do{
            name=prompt("What is the name of the filter?");
            if(name===false){
                return;
            }
        }while(name.trim()==="")
        let filters=[];
        for(let i=0;i<$scope.filters.length;i++){
            if($scope.filters[i].column && $scope.filters[i].operator){
                filters.push({
                    "column":{},
                    "field":$scope.filters[i].column.field,
                    "operator":$scope.filters[i].operator,
                    "value":$scope.filters[i].value
                });
            }
        }
        
        var url="/ws/schema/table/"+filterTable
        var value={
            "tables":{
            }
        };
        value["tables"][filterTable]={
            "teacherId":teacherId+"",
            "name":name,
            "filters":JSON.stringify(
                {
                    "basic":angular.copy($scope.genericFilter),
                    "advanced":filters
                }
            )
        };
        let options={
            "headers":{
                'Content-Type': 'application/json;'
            }
        }
        $http.post(url,JSON.stringify(value),options).then(function(response) {
                loadSavedFilters();
                
            }, function(response) {
                alert("Filter was not saved");
            }
        );
    };
     
    //Should a column appear in the table
    $scope.columnCheck=function(index,data){
        if(data.cols[index].role===undefined){
            return true;
        }else{
            if(data.cols[index].role=="tooltip"){
                return false;
            }else{
                return true;
            }
        }
        return true;
    };
    
    //filter when a bar is selected
    $scope.selectedBar = function(selectedBar,chart) {
        let f=[];
        if(selectedBar){
            if(selectedBar.row===null){
                //Click legend
                let field={
                    field:null,
                    operator:null,
                    value:null
                };
                field.field=chart.field;
                field.operator="=";
                field.value=chart.chartData.data.cols[selectedBar.column].id;
                f.push(field);
                
            }else{
                //click bar
                let value={
                    field:null,
                    operator:null,
                    value:null
                }, field={
                    field:null,
                    operator:null,
                    value:null
                };
                if(chart.chartData.data.cols.length>3){
                    field.field=chart.field;
                    field.operator="=";
                    field.value=chart.chartData.data.cols[selectedBar.column].id;
                    
                    value.field="value";
                    value.operator="=";
                    value.value=chart.chartData.data.rows[selectedBar.row].c[0].v;
                }else{
                    
                    field.field=chart.field;
                    field.operator="=";
                    field.value="1";
                    
                    value.field="value";
                    value.operator="=";
                    value.value=chart.chartData.data.rows[selectedBar.row].c[0].v;
                }
                if(field.field!="value"){
                    f.push(field);
                }
                f.push(value);
            }
            if(confirm("Would you like to filter by this bar?")){
                for(let i=0;i<f.length;i++){
                    $scope.addFilter(f[i]);
                }
                $scope.filter();
            }
        }
    };
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $scope.downloadBtn.show=true;
      // Great success! All the File APIs are supported.    
    }
    
    var downloadFile=function(filename){
        var textFile = null;
        if(filename===undefined){
            filename="download.csv";
        }
        var makeTextFile = function (text) {
            
            var data = new Blob([text], {type: 'text/plain'});
        
            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }
        
            textFile = window.URL.createObjectURL(data);
        
            return textFile;
        };
        filearray=[];
        var file="";
        let headerRow=[];
        for(let i=0;i<$scope.headers.length;i++){
            headerRow.push($scope.headers[i].columnName);
        }
        filearray.push(headerRow);
        for(let i=0;i<$scope.filteredData.length;i++){
            let row=[];
            for(let j=0;j<$scope.headers.length;j++){
                row.push($scope.filteredData[i][$scope.headers[j].field]);
            }
            filearray.push(row);
        }
        for(let i=0;i<filearray.length;i++){
            file+=filearray[i].join(",")+"\n";
        }
        $scope.downloadBtn.href = makeTextFile(file);
    }
    var loadDataSet=function(){
        $scope.pqlist=dataSets;
    };
     loadDataSet();
    loadSavedFilters();
    $scope.getScope=function(){
        console.log($scope)
    };
}]);
