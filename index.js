
const fs = require('fs');
const core = require('@actions/core');

const file = core.getInput('file');
const regex = core.getInput('regex');


/// run
async function run()
{
    try
    {
        const pkg = JSON.parse(fs.readFileSync(file));
        if (pkg.version)
        {
            const ver = parse_version(pkg.version);
            if (ver)
            {
                core.setOutput('version', pkg.version);
            }
            else
            {
                core.setFailed("failed to parse package.json version");
            }
        }
        else
        {
            core.setFailed("invalid package.json does not contain version");
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
        return [match.groups.major, match.groups.minor, match.groups.patch];
    }
    return null
}

run()
