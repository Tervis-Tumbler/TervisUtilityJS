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

export function ConvertTo_RemotePath({
    $Path,
    $ComputerName
}) {
    //https://stackoverflow.com/questions/10610402/javascript-replace-all-commas-in-a-string
    return `\\\\${$ComputerName}\\${$Path.split(":").join("$")}`
}