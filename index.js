
const fs = require('fs');
const core = require('@actions/core');
const xpath = require('xpath')
const { DOMParser } = require('@xmldom/xmldom')

const file = core.getInput('file');
const regex = core.getInput('regex');
const xpath_location = core.getInput('xpath');

/// run
async function run()
{
    try
    {
        const doc = read_csproj(file);
        const verElement = get_csproj_version(doc);
        if (verElement)
        {
            const ver = parse_version(verElement.data);
            if (ver)
            {
                core.setOutput('version', verElement.data);
            }
            else
            {
                core.setFailed("failed to parse .csproj version");
            }
        }
        else
        {
            core.setFailed("invalid .csproj does not contain version");
        }
    }
    catch (error)
    {
        core.setFailed(error.message);
    }
}

function parse_version(version)
{
    let match = version.match(regex);
    if (match)
    {
        return [match.groups.major, match.groups.minor, match.groups.patch, match.groups.prerelease, match.groups.buildmetadata];
    }
    return null
}

function get_csproj_version(doc)
{
    const verElement = xpath.select(xpath_location, doc);

    if (verElement === undefined ||
        verElement.length == 0   ||
        verElement[0] === undefined)
    {
        throw Error("Could not locate version element. Check XPath expression or .csproj file");
    }

    if (verElement)
    {
        return verElement[0].firstChild;
    }
    return null;
}

function read_csproj(csprojfile)
{
    const xml = fs.readFileSync(csprojfile, 'utf8');
    console.log("%s", xml);

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    console.dir({doc});

    if (doc == null)
    {
        throw Error("error while parsing");
    }

    return doc;
}

run()
