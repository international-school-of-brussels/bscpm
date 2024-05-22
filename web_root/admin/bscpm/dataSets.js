var dataSets=[
    {
        "name":"Current Grade",
        "dataSet":"datasets/currentGrades.json",
        "description":"Grades from the gradebook",
        "type":"grades",
        "loadingMessage":"This is a large dataset. It will take several minutes to load.",
        "additionalQuestions":[
            {
                "name":"finalgradename",
                "description":"What Term?",
                "type":"select",
                "value":null,
                "options":[
                    {
                        "name":"S1",
                        "value":"S1"
                    },
                    {
                        "name":"S2",
                        "value":"S2"
                    }
                ]
                
            }
        ]
    },{
        "name":"Historical Grades",
        "dataSet":"datasets/historicalGrades.json",
        "description":"Grades from past semesters",
        "type":"grades",
        "loadingMessage":"This is a large dataset. It will take several minutes to load.",
        "additionalQuestions":[
            {
                "name":"storecode",
                "description":"What Term?",
                "type":"select",
                "value":null,
                "options":[
                    {
                        "name":"S1",
                        "value":"S1"
                    },
                    {
                        "name":"T1",
                        "value":"T1"
                    },
                    {
                        "name":"E1",
                        "value":"E1"
                    },
                    {
                        "name":"S2",
                        "value":"S2"
                    },
                    {
                        "name":"T2",
                        "value":"T2"
                    },
                    {
                        "name":"E2",
                        "value":"E2"
                    }
                ]
                
            }
        ]
    },{
        "name":"Current Enrollments",
        "description":"Students currently enrolled in specific courses",
        "dataSet":"datasets/enrollments.json",
        "type":"enrollments",
        "loadingMessage":"",
        "additionalQuestions":[
            {
                "name":"courses",
                "description":"What Course Set",
                "type":"select",
                "value":null,
                "options":[
                    {
                        "name":"Math (more to all)",
                        "value":"'MA3411','MA3421','MA3911','MA4213','MA4511','MA4521','MA4611','MA5131','MA5231','MA5331','MA5431','MA5531'"
                    },
                    {
                        "name":"Science (more to all)",
                        "value":"'SC4011','SC4021','SC5031','SC5131','SC5141','SC5231'"
                    },
                    {
                        "name":"AP",
                        "value":"'AR5021','AR5022','AR5031','AR5032','AR5033','AR5131','AR5132','AR5231','AR5232','BU5131','BU5132','BU5231','BU5232','BU5431','BU5432','EN3031','EN3032','EN5031','EN5032','EN5131','EN5132','FL5031','FL5032','FL5131','FL5132','FL5231','FL5232','FL5331','FL5332','FL5411','FL5412','FL5431','FL5432','MA5131','MA5132','MA5231','MA5232','MA5331','MA5332','MA5431','MA5432','MU5031','MU5032','SC4023','SC5031','SC5032','SC5131','SC5132','SC5141','SC5142','SC5231','SC5232','SC5331','SC5332','SC5931','SC5932','SS4023','SS5031','SS5032','SS5033','SS5131','SS5132','SS5231','SS5232','SS5331','SS5332','SS5333','SS5432','SS5433','SS5533','SS5631','SS5632','SS6012'"
                    }
                ]
            },
            {
                "name":"otherCourses",
                "description":"Manual Course Numbers (comma seperated)",
                "type":"text",
                "value":"",
                "valueProccessing":function(value){
                    value=value.trim();
                    if(value===""){
                        return value;
                    }
                    var valueArray=[];
                    value.split(',').forEach(function(a){
                        valueArray.push("'"+a.trim()+"'");
                    });
                    return valueArray.join(",");
                }
            }
        ]
    },
    {
        "name":"Historical Enrollments",
        "description":"Students enrolled in specific courses in the past.",
        "dataSet":"datasets/historicalEnrollments.json",
        "type":"enrollments",
        "loadingMessage":"",
        "additionalQuestions":[
            {
                "name":"enrolldate",
                "description":"Date of Enrollment",
                "type":"date",
                "value":"",
                "valueProccessing":function(value){
                    var d=new Date(value);
                    return ""+(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear();
                }
            },
            {
                "name":"courses",
                "description":"What Course Set",
                "type":"select",
                "value":null,
                "options":[
                    {
                        "name":"Math (more to all)",
                        "value":"'MA3411','MA3421','MA3911','MA4213','MA4511','MA4521','MA4611','MA5131','MA5231','MA5331','MA5431','MA5531'"
                    },
                    {
                        "name":"Science (more to all)",
                        "value":"'SC4011','SC4021','SC5031','SC5131','SC5141','SC5231'"
                    },
                    {
                        "name":"AP",
                        "value":"'AR5021','AR5022','AR5031','AR5032','AR5033','AR5131','AR5132','AR5231','AR5232','BU5131','BU5132','BU5231','BU5232','BU5431','BU5432','EN3031','EN3032','EN5031','EN5032','EN5131','EN5132','FL5031','FL5032','FL5131','FL5132','FL5231','FL5232','FL5331','FL5332','FL5411','FL5412','FL5431','FL5432','MA5131','MA5132','MA5231','MA5232','MA5331','MA5332','MA5431','MA5432','MU5031','MU5032','SC4023','SC5031','SC5032','SC5131','SC5132','SC5141','SC5142','SC5231','SC5232','SC5331','SC5332','SC5931','SC5932','SS4023','SS5031','SS5032','SS5033','SS5131','SS5132','SS5231','SS5232','SS5331','SS5332','SS5333','SS5432','SS5433','SS5533','SS5631','SS5632','SS6012'"
                    }
                ]
            },
            {
                "name":"otherCourses",
                "description":"Manual Course Numbers (comma seperated)",
                "type":"text",
                "value":"",
                "valueProccessing":function(value){
                    value=value.trim();
                    if(value===""){
                        return value;
                    }
                    var valueArray=[];
                    value.split(',').forEach(function(a){
                        valueArray.push("'"+a.trim()+"'");
                    });
                    return valueArray.join(",");
                }
            }
        ]
    },
     {
        "name":"Grade Match",
        "dataSet":"datasets/gradeMatch.json",
        "description":"Compare student that match the grade counts below.",
        "type":"count",
        "loadingMessage":"",
        "additionalQuestions":[
            {
                "name":"type",
                "description":"Grade Type",
                "type":"select",
                "value":"historical",
                "options":[
                    {
                        "name":"Historical",
                        "value":"historical"
                    },
                    {
                        "name":"Current",
                        "value":"current"
                    }
                ]
            },
            {
                "name":"grades",
                "description":"Grades to include (comma seperated)",
                "type":"text",
                "value":"1",
                "valueProccessing":function(value){
                    value=value.trim();
                    if(value===""){
                        return value;
                    }
                    var valueArray=[];
                    value.split(',').forEach(function(a){
                        valueArray.push("'"+a.trim()+"'");
                    });
                    return valueArray.join(",");
                }
            },
            {
                "name":"numOfGrades",
                "description":"Minimum Number of grades",
                "type":"text",
                "value":"1"
            }
            
        ]
    }
];
