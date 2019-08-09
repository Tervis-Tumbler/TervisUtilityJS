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

export function sdf ({
    $Array,
    $NumberOfPositionsToRotate
}) {
    var n = $NumberOfPositionsToRotate - 1
    while ($Array.length && n < 0) n += $Array.length;
    $Array.push.apply($Array, $Array.splice(0, n));
    return $Array;
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