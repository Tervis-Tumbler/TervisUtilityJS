import uuidv4 from 'uuid/v4.js'
import got from 'got'
import fs from 'fs-extra'

export function Add_MemberScriptProperty ({
    $InputObject,
    $Name,
    $Value
}) {
    if (Array.isArray($InputObject)) {
        for (var $InputObjectInstance of $InputObject) {
            Object.defineProperty($InputObjectInstance, $Name, {
                get: $Value
            })
        }
    } else {
        Object.defineProperty($InputObject, $Name, {
            get: $Value
        })
    }
} 

export function New_HashTableIndex ({
    $InputObject,
    $PropertyToIndex
}) {
    var $HashTable = {}
    for (const $InputObjectInstance of $InputObject) {
        const $PropertyToIndexPropertyValue = $InputObjectInstance[$PropertyToIndex]
        if (Array.isArray($PropertyToIndexPropertyValue)) {
            for (const $PropertyToIndexValueInstance of $PropertyToIndexPropertyValue) {
                $HashTable[$PropertyToIndexValueInstance] = $InputObjectInstance
            }
        } else {
            $HashTable[$PropertyToIndexPropertyValue] = $InputObjectInstance
        }
    }
    return $HashTable
}

export function ConvertFrom_StringUsingRegexCaptureGroup ({
    $Regex,
    $String
}) {
    var $Results = $Regex.exec($String)
    if ($Results) {
        return $Results.groups
    }
}

//https://stackoverflow.com/a/1985308/101679
export function Invoke_ArrayRotate ({
    $Array,
    $NumberOfPositionsToRotate
}) {
    return $Array
    .slice($NumberOfPositionsToRotate, $Array.length)
    .concat(
        $Array.slice(
            0,
            $NumberOfPositionsToRotate
        )
    )
}

export async function Invoke_ProcessTemplateFile ({
    $TemplateFilePath,
    $TemplateVariables
}) {
    let $TemplateContent = await fs.readFile($TemplateFilePath, "utf-8")
    var $Result = Invoke_ProcessTemplate({ $TemplateContent, $TemplateVariables })
    return $Result
}

export function Invoke_ProcessTemplate ({
    $TemplateContent,
    $TemplateVariables
}) {
    let $TemplateContentAsTemplateLiteral = `
\`
${$TemplateContent}
\`
`
    var $TemplateAfterProcessing = eval($TemplateContentAsTemplateLiteral)
    return $TemplateAfterProcessing
}

export function Remove_ObjectKeyWithEmptyOrNullValue (obj) {
    Object.entries(obj).forEach(([key, val]) => {
        if (val && typeof val === 'object') { 
            removeEmpty(val) 
        }
        else if (val == null) {
            delete obj[key]
        }
    })
    return obj
}

export function Get_GUIDFromString ({
    $String
}) {
    var $Results = ConvertFrom_StringUsingRegexCaptureGroup({
        $Regex: /(?<$GUID>\w{8}-?\w{4}-?\w{4}-?\w{4}-?\w{12}?)/u,
        $String
    })

    if ($Results) {
        return $Results.$GUID
    }
}

//https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
export function New_NumberRange ({$Size, $StartAt = 0}) {
    return [...Array($Size).keys()].map(i => i +$StartAt);
}

export function New_TemporaryDirectory({
    $TemporaryFolderType
}) {
    let $GUID = uuidv4()
    let $TemporaryFolderRoot = (() => {
        if ($TemporaryFolderType === "System") {
            return `C:\\windows\\temp`
        }
    })()

	return `${$TemporaryFolderRoot}\\${$GUID}`
}

export function ConvertTo_RemotePath({
    $Path,
    $ComputerName
}) {
    //https://stackoverflow.com/questions/10610402/javascript-replace-all-commas-in-a-string
    return `\\\\${$ComputerName}\\${$Path.split(":").join("$")}`
}

export function Invoke_FileDownload({
    $URI,
    $OutFile
}) {
    return new Promise((resolve, reject) => {
        const options = {
            url: $URI,
            timeout: 120000,
            stream: true,
        }
        const stream = got(options).pause();
        let fileStream;

        stream.on("error", error => {
            if (fileStream) {
                fileStream.destroy();
            }
            reject(error);
        });
        stream.on("data", data => {
            fileStream.write(data);
        });
        stream.on("end", () => {
            fileStream.end();
        });
        stream.on("response", function () {
            fileStream = fs.createWriteStream($OutFile);
            fileStream.on("error", error => {
                stream.destroy();
                reject(error);
            })
            fileStream.on("close", () => {
                resolve($OutFile);
            });
            this.resume();
        });
    });
}