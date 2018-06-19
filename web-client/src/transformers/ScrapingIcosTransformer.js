
import Transformer from './Transformer';

export default class ScrapingIcosTransformer extends Transformer {
  static fetch (icos) {
    var result = {};
    for (let i in icos) {
      result[icos[i]._id] = {
        id: icos[i]._id,
        name: icos[i].name,
        website: icos[i].website,
        resources: icos[i].resources.map(element => { return { name: element, code: element } }),
        maininfo: icos[i].maininfo,
        finance: icos[i].finance,
        dates: icos[i].dates,
        team: {
          members: icos[i].team.members.map(element => { return element.name + ' (' + element.link + ') - ' + element.title }).join('\n'),
          from: icos[i].team.from,
          size: icos[i].team.size
        },
        links: icos[i].links,
        features: icos[i].features,
        bounty: icos[i].bounty,
        wallets: icos[i].wallets,
        milestones: icos[i].milestones.map(element => { return element.date + ' || ' + element.content }).join('\n'),
        distribution: icos[i].distribution,
        additionalLinks: JSON.stringify(icos[i].additionalLinks),
        screenShorts: JSON.stringify(icos[i].screenShorts),
        rating: icos[i].rating,
        timestamp: icos[i].timestamp
      }
    }
    return result;
  }
  static send (ico) {
    return {
      _id: ico.id,
      name: ico.name,
      website: ico.website,
      resources: ico.resources.map(element => { return element.name }),
      maininfo: ico.maininfo,
      finance: ico.finance,
      dates: {
        preIcoStart: ico.dates.preIcoStart,
        preIcoEnd: ico.dates.preIcoEnd,
        icoStart: ico.dates.icoStart,
        icoEnd: ico.dates.icoEnd,
        durationPreIco: (ico.dates.preIcoStart === null || ico.dates.preIcoEnd === null) ? 0 : ((+new Date(ico.dates.preIcoStart) - +new Date(ico.dates.preIcoEnd)) / (1000 * 60 * 60 * 24 * 7)).toFixed(2),
        durationIco: (ico.dates.icoStart === null || ico.dates.icoEnd === null) ? 0 : ((+new Date(ico.dates.icoStart) - +new Date(ico.dates.icoEnd)) / (1000 * 60 * 60 * 24 * 7)).toFixed(2)
      },
      team: {
        members: ico.team.members ? ico.team.members.split('\n').map(element => { return { name: element.split('(')[0].trim(), link: element.split('(')[1].split(')')[0], title: element.split('-')[1].trim() } }) : [],
        from: ico.team.from,
        size: ico.team.size
      },
      links: ico.links,
      features: ico.features,
      bounty: ico.bounty,
      wallets: ico.wallets,
      milestones: ico.milestones ? ico.milestones.split('\n').map(element => { return { date: element.split('||')[0].trim(), content: element.split('||')[1].trim() } }) : [],
      distribution: ico.distribution,
      additionalLinks: Transformer.isJsonString(ico.additionalLinks) ? JSON.parse(ico.additionalLinks) : {},
      screenShorts: Transformer.isJsonString(ico.screenShorts) ? JSON.parse(ico.screenShorts) : {},
      rating: ico.rating,
      timestamp: ico.timestamp
    }
  }
}
