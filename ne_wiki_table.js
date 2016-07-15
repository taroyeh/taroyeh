/**
 * Required: https://github.com/jonschlinkert/strip-comments 
 */

function parse(jCode, headerTexts, regExp) {
    jCode = removeComments(jCode);
    var result = [];
    var match = regExp.exec(jCode);
    while (match != null) {
        var obj = {};
        for (var i = 0; i < headerTexts.length; i++) {
            obj[headerTexts[i]] = match[i + 1];
        }
        result.push(obj);
        match = regExp.exec(jCode);
    }
    return result;
}

function render(parsedData, headerTexts, fieldCentralized) {
    var maxLength = {};
    for (var i = 0; i < headerTexts.length; i++) {
        var attr = headerTexts[i];
        maxLength[attr] = attr.length;
    }

    for (var i in parsedData) {
        var obj = parsedData[i];
        for (var i = 0; i < headerTexts.length; i++) {
            var attr = headerTexts[i];
            if (!!fieldCentralized && fieldCentralized.hasOwnProperty(i) && fieldCentralized[i] == true) {
                obj[attr] = " " + obj[attr] + " ";
            }
            if (obj[attr].length > maxLength[attr]) {
                maxLength[attr] = obj[attr].length;
            }
        }
    }

    var header = "^ ";
    for (var i = 0; i < headerTexts.length; i++) {
        var attr = headerTexts[i];
        header += paddingString(attr, maxLength[attr]) + " ^ ";
    }
    header += "\n";

    var body = "";
    for (var i in parsedData) {
        var obj = parsedData[i];
        var row = "| ";
        for (var i = 0; i < headerTexts.length; i++) {
            var attr = headerTexts[i];
            row += paddingString(obj[attr], maxLength[attr]) + " | ";
        }
        body += row + "\n";
    }

    return header + body;
}

function paddingString(str, digits) {
    var len = str.length;
    if (digits > len) {
        for (var i = len; i < digits; i++) {
            str += " ";
        }
    }
    return str;
}

function removeComments(code) {
    var cs = new CommentStripper();
    var result = cs.strip(code);
    return result;
}
