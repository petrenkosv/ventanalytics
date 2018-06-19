const axios     = require('axios');
let GithubModel = require('../models/Github');


let getRepositories_ = (org) => {
    return axios.get('https://api.github.com/orgs/' + org + '/repos',
        {
            params: { access_token: process.env.GITHUB_TOKEN }
        })
        .then(response => {
            return (response.data.message === "Not Found") ? "error" : response.data;
        })
        .catch(error => {
            return "error";
        })
};


let getContributors = (organization, repository) => {
    return axios.get('https://api.github.com/repos/' + organization + '/' + repository.name + '/stats/contributors',
        {
            params: { access_token: process.env.GITHUB_TOKEN }
        })
        .then(response => {
            let repJSON = response.data;

            if (repJSON.message === "Not Found") {
                return "error";
            }

            let rep = new GithubModel.rep(repository.html_url, repository.name);

            for (let j in repJSON) {
                if (repJSON[j].author) {
                    let author = new GithubModel.author(repJSON[j].author.login),
                        weeks = repJSON[j].weeks;

                    for (let t in weeks) {
                        if (weeks[t].w > (+new Date() / 1000 - 365*24*60*60)) {
                            author.addAddition(weeks[t].a);
                            author.addDeletions(weeks[t].d);
                            author.addCommits(weeks[t].c);
                        }
                    }
                    rep.addAuthor(author)
                }
            }

            if (rep.totalCommits > 0) {
                rep.calcAuthorChanges();
                return rep;
            } else {
                return "error";
            }

        }).catch(error => {
            return "error";
        })
};


module.exports = async (organiztion) => {
    let github  = new GithubModel.org(organiztion),
        orgJSON = await getRepositories_(organiztion);

    if (orgJSON === "error") {
        return null;
    }

    let i = 0;

    while (i < orgJSON.length) {
        let rep = await getContributors(organiztion, orgJSON[i]);
        if (rep !== "error") {
            github.addRep(rep);
        }
        i++;
    }

    github.complete();
    return github;
};