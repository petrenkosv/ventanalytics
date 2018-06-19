let sortGithubRepos = (reposA, reposB) => {
    return reposB.totalCommits - reposA.totalCommits;
};

let sortGithubAuthors = (authorA, authorB) => {
    return parseFloat(authorB.changes) - parseFloat(authorA.changes);
};

class Organization {
    constructor(name) {
        this.orgName = name;
        this.orgLink = "https://github.com/"+name;
        this.repos = []
    }

    addRep(rep) {
        this.repos.push(rep)
    };

    complete() {
        this.repos.sort(sortGithubRepos);
        if (this.repos.length > 3)
            this.repos.splice(3, this.repos.length);
        for (let i = 0; i < this.repos.length; i++) {
            this.repos[i].authors.sort(sortGithubAuthors);
            if (this.repos[i].authors.length > 3)
                this.repos[i].authors.splice(3, this.repos[i].authors.length);
        }
    };

}

class Repository {
    constructor(name) {
        this.link = name;
        this.totalCommits = 0;
        this.totalAdditions = 0;
        this.totalDeletions= 0;
        this.authors = [];
    }

    addAuthor(author) {
        this.authors.push(author);
        this.totalCommits += author.commits;
        this.totalAdditions += author.additions;
        this.totalDeletions += author.deletions;
    };

    calcAuthorChanges(){
        for (let i = 0; i < this.authors.length; i++) {
            this.authors[i].changes = ((this.authors[i].additions + this.authors[i].deletions) / (this.totalAdditions + this.totalDeletions) * 100).toFixed(2)
        }
    }
}

class Author {
    constructor(name) {
        this.name = name;
        this.changes = 0;
        this.additions = 0;
        this.deletions = 0;
        this.commits = 0;
    };
    addAddition(num) {
        this.additions += num;
    };
    addDeletions(num) {
        this.deletions += num;
    };
    addCommits(num) {
        this.commits += num;
    }
}


module.exports = {
    org     : Organization,
    rep     : Repository,
    author  : Author
};