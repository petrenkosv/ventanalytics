<template>
  <b-row>
    <form class="col-lg-12"
          @submit.prevent="validateForm('form')"
          :data-vv-scope="'form'">
      <b-card no-body>
        <div slot="header">
          <strong>{{formModel.name}}</strong> - {{new Date(formModel.timestamp).toISOString().split('T')[0] }}
        </div>
        <b-card-body>
            <b-row>
              <b-col lg="6">
                <b-form-group label="ICO name" :label-for="'icoName'">
                  <b-form-input :id="'icoName'"
                                type="text"
                                name="name"
                                autocomplete="off"
                                v-validate="{required: true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.name') }"
                                v-model="formModel.name"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.name') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Website" :label-for="'icoWebsite'">
                  <b-form-input :id="'icoWebsite'"
                                type="text"
                                name="website"
                                autocomplete="off"
                                v-validate="{required: true, url: 'http'}"
                                v-bind:class="{ 'is-invalid': errors.has('form.website') }"
                                v-model="formModel.website"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.website') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group label="Resources" :label-for="'icoResources'" description="Set links from where data received.">
              <multiselect v-model="formModel.resources"
                           tag-placeholder="Add new resource"
                           placeholder="Search or add a resource"
                           label="name"
                           track-by="code"
                           :options="formModel.resourcesOpt"
                           :multiple="true"
                           :taggable="true"
                           @tag="addResource"/>
            </b-form-group>

            <h4>Main info</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Description" :label-for="'icoDescription'" description="Description from icoDrops or icoRating.">
                  <b-form-textarea :id="'icoDescription'"
                                   rows="7"
                                   type="text"
                                   autocomplete="off"
                                   v-model="formModel.maininfo.description"></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Country" :label-for="'icoCountry'">
                  <multiselect
                    :id="'icoCountry'"
                    v-model="formModel.maininfo.country"
                    :options='countries'
                    autocomplete="off"
                    group-values="countries"
                    group-label="region"
                    :group-select="false"
                    name="country"
                    :close-on-select="true"
                    :show-labels="false"
                    :multiple="false"
                    @select="setRegion"
                    placeholder="Choose a country"/>
                </b-form-group>
                <b-form-group label="Region" :label-for="'icoRegion'">
                  <multiselect
                    :id="'icoRegion'"
                    v-model="formModel.maininfo.region"
                    :options='regions'
                    autocomplete="off"
                    name="region"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Choose a region"/>
                </b-form-group>
                <b-form-group label="Company" :label-for="'icoCompany'">
                  <b-form-input :id="'icoCompany'"
                                type="text"
                                name="company"
                                autocomplete="off"
                                v-model="formModel.maininfo.company"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="About" :label-for="'icoAbout'" description="About ICO from icoBench.">
                  <b-form-textarea :id="'icoAbout'"
                                   rows="5"
                                   type="text"
                                   autocomplete="off"
                                   v-model="formModel.maininfo.about"></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Intro" :label-for="'icoInto'" description="About ICO from icoBench.">
                  <b-form-textarea :id="'icoInto'"
                                   rows="5"
                                   type="text"
                                   autocomplete="off"
                                   v-model="formModel.maininfo.intro"></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Finance</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Token symbol" :label-for="'icoTokenSymbol'" description="Example: BTC">
                  <b-form-input :id="'icoTokenSymbol'"
                                type="text"
                                name="tokenSymbol"
                                autocomplete="off"
                                v-model="formModel.finance.token"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Category" :label-for="'icoCategory'">
                <multiselect
                  :id="'icoCategory'"
                  v-model="formModel.finance.category"
                  :options='categories'
                  autocomplete="off"
                  name="category"
                  :searchable="true"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Choose a category"/>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Token type" :label-for="'icoTokenType'" description="Example: ERC20">
                  <b-form-input :id="'icoTokenType'"
                                type="text"
                                name="tokenType"
                                autocomplete="off"
                                v-model="formModel.finance.tokenType"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Total tokens" :label-for="'icoTotalTokens'">
                  <b-form-input :id="'icoTokenType'"
                                type="number"
                                name="totalTokens"
                                autocomplete="off"
                                v-model="formModel.finance.totalTokens"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Sale tokens" :label-for="'icoSaleTokens'">
                  <b-form-input :id="'icoSaleTokens'"
                                type="number"
                                name="saleTokens"
                                autocomplete="off"
                                v-model="formModel.finance.saleTokens"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Sale percent" :label-for="'icoSalePercent'"  description="Sale tokens dived on total tokens, %. Example: set 20 means 20%">
                  <b-form-input :id="'icoSalePercent'"
                                type="number"
                                step="0.1"
                                name="salePercent"
                                autocomplete="off"
                                v-model="formModel.finance.salePercent"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Price" :label-for="'icoPrice'" description="Price of 1 token in USD">
                  <b-form-input :id="'icoPrice'"
                                type="number"
                                name="price"
                                step="0.01"
                                autocomplete="off"
                                v-model="formModel.finance.price"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Accepting" :label-for="'icoAccepting'" description="Separated by commas.">
                  <b-form-input :id="'icoAccepting'"
                                type="text"
                                name="accepting"
                                autocomplete="off"
                                v-model="formModel.finance.accepting"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Role of token" :label-for="'icoTokensRole'">
                  <b-form-input :id="'icoTokensRole'"
                                type="text"
                                name="tokensRole"
                                autocomplete="off"
                                v-model="formModel.finance.tokensRole"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Dividends" :label-for="'icoDividends'">
                  <b-form-input :id="'icoDividends'"
                                type="text"
                                name="dividends"
                                autocomplete="off"
                                v-model="formModel.finance.dividends"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Additional token emission" :label-for="'icoEmission'">
                  <b-form-input :id="'icoEmission'"
                                type="text"
                                name="emission"
                                autocomplete="off"
                                v-model="formModel.finance.emission"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Escrow" :label-for="'icoEscrow'">
                  <b-form-input :id="'icoEscrow'"
                                type="text"
                                name="escrow"
                                autocomplete="off"
                                v-model="formModel.finance.escrow"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Total money" :label-for="'icoTotalMoney'" description="Raised, in $">
                  <b-form-input :id="'icoTotalMoney'"
                                type="number"
                                name="totalMoney"
                                autocomplete="off"
                                v-model="formModel.finance.totalMoney"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Hardcap" :label-for="'icoHardcap'" description="Set in $">
                  <b-form-input :id="'icoHardcap'"
                                type="number"
                                name="hardcap"
                                autocomplete="off"
                                v-model="formModel.finance.hardcap"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Softcap" :label-for="'icoSoftcap'" description="Set in $">
                  <b-form-input :id="'icoSoftcap'"
                                type="number"
                                name="softcap"
                                autocomplete="off"
                                v-model="formModel.finance.softcap"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Distributed" :label-for="'icoDistributed'" description="Set in %">
                  <b-form-input :id="'icoDistributed'"
                                type="number"
                                step="0.1"
                                name="distributed"
                                autocomplete="off"
                                v-model="formModel.finance.distributed"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group
                  label="Bonus"
                  :label-for="'icoBonus'"
                  :label-cols="2"
                  :horizontal="false">
                  <b-form-radio-group :id="'icoBonus'"
                                      :plain="true"
                                      :checked="formModel.finance.bonus"
                                      v-model="formModel.finance.bonus"
                                      :options="[ {text: 'True ', value: 'true'}, {text: 'False ',value: 'false'} ]">
                  </b-form-radio-group>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Platform" :label-for="'icoPlatform'">
                  <b-form-input :id="'icoPlatform'"
                                type="text"
                                name="platform"
                                autocomplete="off"
                                v-model="formModel.finance.platform"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Dates</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Pre ICO start" :label-for="'icoPreIcoStart'" description="Must in format `YYYY-MM-DD`">
                  <b-form-input :id="'icoPreIcoStart'"
                                type="date"
                                name="preIcoStart"
                                autocomplete="off"
                                v-model="formModel.dates.preIcoStart"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Pre ICO end" :label-for="'icoPreIcoEnd'" description="Must in format `YYYY-MM-DD`">
                  <b-form-input :id="'icoPreIcoEnd'"
                                type="date"
                                name="preIcoEnd"
                                autocomplete="off"
                                v-model="formModel.dates.preIcoEnd"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="ICO start" :label-for="'icoIcoStart'" description="Must in format `YYYY-MM-DD`">
                  <b-form-input :id="'preIcoStart'"
                                type="date"
                                name="icoStart"
                                autocomplete="off"
                                v-model="formModel.dates.icoStart"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="ICO end" :label-for="'icoIcoEnd'" description="Must in format `YYYY-MM-DD`">
                  <b-form-input :id="'icoIcoEnd'"
                                type="date"
                                name="icoEnd"
                                autocomplete="off"
                                v-model="formModel.dates.icoEnd"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Pre ICO duration" :label-for="'icoDurationPreIco'" description="In weeks">
                  <b-form-input :id="'icoDurationPreIco'"
                                type="number"
                                step="0.1"
                                name="durationPreIco"
                                autocomplete="off"
                                :disabled="true"
                                :value="(formModel.dates.preIcoStart === null || formModel.dates.preIcoEnd === null) ? 0 : ((+new Date(formModel.dates.preIcoEnd) - +new Date(formModel.dates.preIcoStart))/(1000*60*60*24*7)).toFixed(2)"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="ICO duration" :label-for="'icoDurationIco'" description="In weeks">
                  <b-form-input :id="'icoDurationIco'"
                                type="number"
                                step="0.1"
                                name="durationIco"
                                autocomplete="off"
                                :disabled="true"
                                :value="(formModel.dates.icoStart === null || formModel.dates.icoEnd === null) ? 0 : ((+new Date(formModel.dates.icoEnd) - +new Date(formModel.dates.icoStart))/(1000*60*60*24*7)).toFixed(2)"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Team</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Team from" :label-for="'icoTeamFrom'" description="Set country">
                  <b-form-input :id="'icoTeamFrom'"
                                type="text"
                                name="teamFrom"
                                autocomplete="off"
                                v-model="formModel.team.from"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Team size" :label-for="'icoTeamSize'">
                  <b-form-input :id="'icoTeamSize'"
                                type="number"
                                name="teamSize"
                                autocomplete="off"
                                v-model="formModel.team.size"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group label="Team members" :label-for="'icoTeamMembers'" description="Set in format `MemberName (MemberLink) - MemberTitle`.<br>Example: George Goognin (https://www.facebook.com/goognin) - Founder, Evangelist">
              <b-form-textarea :id="'icoTeamMembers'"
                               rows="5"
                               type="text"
                               autocomplete="off"
                               v-model="formModel.team.members"></b-form-textarea>
            </b-form-group>

            <h4>Links</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Whitepaper" :label-for="'icoWhitepaper'">
                  <b-form-input :id="'icoWhitepaper'"
                                type="text"
                                name="whitepaper"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.whitepaper') }"
                                v-model="formModel.links.whitepaper"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.whitepaper') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Twitter" :label-for="'icoTwitter'">
                  <b-form-input :id="'icoTwitter'"
                                type="text"
                                name="twitter"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.twitter') }"
                                v-model="formModel.links.twitter"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.twitter') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Telegram" :label-for="'icoTelegram'">
                  <b-form-input :id="'icoTelegram'"
                                type="text"
                                name="telegram"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.telegram') }"
                                v-model="formModel.links.telegram"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.telegram') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Medium" :label-for="'icoMedium'">
                  <b-form-input :id="'icoMedium'"
                                type="text"
                                name="medium"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.medium') }"
                                v-model="formModel.links.medium"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.medium') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Slack" :label-for="'icoSlack'">
                  <b-form-input :id="'icoSlack'"
                                type="text"
                                name="slack"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.slack') }"
                                v-model="formModel.links.slack"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.slack') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Reddit" :label-for="'icoReddit'">
                  <b-form-input :id="'icoReddit'"
                                type="text"
                                name="reddit"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.reddit') }"
                                v-model="formModel.links.reddit"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.reddit') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Linkedin" :label-for="'icoLinkedin'">
                  <b-form-input :id="'icoLinkedin'"
                                type="text"
                                name="linkedin"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.linkedin') }"
                                v-model="formModel.links.linkedin"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.linkedin') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Facebook" :label-for="'icoFacebook'">
                  <b-form-input :id="'icoFacebook'"
                                type="text"
                                name="facebook"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.facebook') }"
                                v-model="formModel.links.facebook"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.facebook') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Github" :label-for="'icoGithub'">
                  <b-form-input :id="'icoGithub'"
                                type="text"
                                name="github"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.github') }"
                                v-model="formModel.links.github"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.github') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Crunchbase" :label-for="'icoCrunchbase'">
                  <b-form-input :id="'icoCrunchbase'"
                                type="text"
                                name="crunchbase"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.crunchbase') }"
                                v-model="formModel.links.crunchbase"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.crunchbase') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Bitcointalk" :label-for="'icoBitcointalk'">
                  <b-form-input :id="'icoBitcointalk'"
                                type="text"
                                name="bitcointalk"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.bitcointalk') }"
                                v-model="formModel.links.bitcointalk"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.bitcointalk') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Youtube" :label-for="'icoYoutube'">
                  <b-form-input :id="'icoYoutube'"
                                type="text"
                                name="youtube"
                                autocomplete="off"
                                v-validate="{url:true}"
                                v-bind:class="{ 'is-invalid': errors.has('form.youtube') }"
                                v-model="formModel.links.youtube"></b-form-input>
                  <b-form-invalid-feedback>
                    {{ errors.first('form.youtube') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Features</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="Features" :label-for="'icoFeaturesContent'" description="Features from icoRating.">
                    <b-form-textarea :id="'icoFeaturesContent'"
                                     rows="5"
                                     autocomplete="off"
                                     v-model="formModel.features.content"></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Technical details" :label-for="'icoFeaturesDetails'"  description="Technical details from icoRating.">
                  <b-form-textarea :id="'icoFeaturesDetails'"
                                rows="5"
                                autocomplete="off"
                                v-model="formModel.features.techDetails"></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Bounty</h4>

            <b-form-group label="Bounty link" :label-for="'icoBountyLink'">
              <b-form-input :id="'icoBountyLink'"
                            type="text"
                            name="bountyLink"
                            autocomplete="off"
                            v-validate="{url: true}"
                            v-bind:class="{ 'is-invalid': errors.has('form.bountyLink') }"
                            v-model="formModel.bounty.link"></b-form-input>
              <b-form-invalid-feedback>
                {{ errors.first('form.bountyLink') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Bounty scheme" :label-for="'icoBountyScheme'">
              <b-form-textarea :id="'icoBountyScheme'"
                               rows="3"
                               autocomplete="off"
                               v-model="formModel.bounty.scheme"></b-form-textarea>
            </b-form-group>

            <h4>Wallets</h4>

            <b-row>
              <b-col lg="6">
                <b-form-group label="ETH address" :label-for="'icoWalletETH'">
                  <b-form-input :id="'icoWalletETH'"
                                type="text"
                                name="walletETH"
                                autocomplete="off"
                                v-model="formModel.wallets.eth"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="BTC address" :label-for="'icoWalletBTC'">
                  <b-form-input :id="'icoWalletBTC'"
                                type="text"
                                name="walletBTC"
                                autocomplete="off"
                                v-model="formModel.wallets.btc"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <h4>Milestones</h4>

            <b-form-group :label-for="'icoMilestones'" description="Set in format `Date || content`.">
              <b-form-textarea :id="'icoMilestones'"
                               rows="3"
                               type="text"
                               autocomplete="off"
                               v-model="formModel.milestones"></b-form-textarea>
            </b-form-group>

            <h4>Token distribution</h4>

            <b-form-group label="Token distribution" :label-for="'icoDistribution'">
              <b-form-textarea :id="'icoDistribution'"
                               rows="3"
                               type="text"
                               autocomplete="off"
                               v-model="formModel.distribution"></b-form-textarea>
            </b-form-group>

            <h4>Additional links</h4>

            <b-form-group :label-for="'icoAdditionalLinks'" description='Set in format `{"name":"http://example.com", "name2": "https://example1.com"}`.'>
              <b-form-textarea :id="'icoAdditionalLinks'"
                               rows="3"
                               type="text"
                               autocomplete="off"
                               v-model="formModel.additionalLinks"></b-form-textarea>
            </b-form-group>

            <h4>Screen shorts</h4>

            <b-form-group :label-for="'icoScreenShorts'" description='Set in format `{"name":"http://example.com", "name2": "https://example1.com"}`.'>
              <b-form-textarea :id="'icoScreenShorts'"
                               rows="3"
                               type="text"
                               autocomplete="off"
                               v-model="formModel.screenShorts"></b-form-textarea>
            </b-form-group>

            <h4>Rating</h4>

            <b-row class="form-group">
              <b-col sm="3" xs="6">
                <b-form-group label="ICODrops total rate" :label-for="'icoRatingIcoDropsTotalRate'">
                  <b-form-input :id="'icoRatingIcoDropsTotalRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icodrops.totalrate"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICODrops hype rate" :label-for="'icoRatingIcoDropsHypeRate'">
                  <b-form-input :id="'icoRatingIcoDropsHypeRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icodrops.hyperate"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICODrops risk rate" :label-for="'icoRatingIcoDropsRiskRate'">
                  <b-form-input :id="'icoRatingIcoDropsRiskRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icodrops.riskrate"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICODrops ROI rate" :label-for="'icoRatingIcoDropsROIRate'">
                  <b-form-input :id="'icoRatingIcoDropsROIRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icodrops.roirate"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row class="form-group">
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBench total rate" :label-for="'icoRatingICOBenchTotalRate'">
                  <b-form-input :id="'icoRatingICOBenchTotalRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobench.total"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBench profile rate" :label-for="'icoRatingICOBenchProfileRate'">
                  <b-form-input :id="'icoRatingICOBenchProfileRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobench.profile"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBench team rate" :label-for="'icoRatingICOBenchTeamRate'">
                  <b-form-input :id="'icoRatingICOBenchTeamRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobench.team"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBench vision rate" :label-for="'icoRatingICOBenchVisionRate'">
                  <b-form-input :id="'icoRatingICOBenchVisionRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobench.vision"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBench product rate" :label-for="'icoRatingICOBenchProductRate'">
                  <b-form-input :id="'icoRatingICOBenchProductRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobench.product"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row class="form-group">
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBazaar total rate" :label-for="'icoRatingICOBazaarTotalRate'">
                  <b-form-input :id="'icoRatingICOBazaarTotalRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobazaar.total"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBazaar team rate" :label-for="'icoRatingICOBazaarTeamRate'">
                  <b-form-input :id="'icoRatingICOBazaarTeamRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobazaar.team"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBazaar team rate" :label-for="'icoRatingICOBazaarIdeaRate'">
                  <b-form-input :id="'icoRatingICOBazaarIdeaRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobazaar.idea"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBazaar media rate" :label-for="'icoRatingICOBazaarMediaRate'">
                  <b-form-input :id="'icoRatingICOBazaarMediaRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobazaar.media"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICOBazaar technology rate" :label-for="'icoRatingICOBazaarTechRate'">
                  <b-form-input :id="'icoRatingICOBazaarTechRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icobazaar.technology"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row class="form-group">
              <b-col sm="3" xs="6">
                <b-form-group label="ICORating investment rate" :label-for="'icoRatingICORatingInvestmentRate'">
                  <b-form-input :id="'icoRatingICORatingInvestmentRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icorating.investment"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICORating hype rate" :label-for="'icoRatingICORatingHypeRate'">
                  <b-form-input :id="'icoRatingICORatingHypeRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icorating.hypescore"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="3" xs="6">
                <b-form-group label="ICORating risk rate" :label-for="'icoRatingICORatingRiskRate'">
                  <b-form-input :id="'icoRatingICORatingRiskRate'"
                                type="number"
                                step="0.1"
                                v-model="formModel.rating.icorating.riskscore"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row class="form-group">
              <b-col sm="3" xs="6">
                <b-form-group label="VentAnalytics p_hardcap" :label-for="'icoRatingVentAnalyticsP_Hardcap'">
                  <b-form-input :id="'icoRatingVentAnalyticsP_Hardcap'"
                                type="number"
                                step="0.1"
                                :disabled="true"
                                v-model="formModel.rating.ventanalytics.p_hardcap"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>

            <div class="form-actions">
              <b-button type="submit" variant="primary">Save changes</b-button>
            </div>
          </b-card-body>
      </b-card>
    </form>
  </b-row>
</template>
<script>
  import Multiselect from 'vue-multiselect';
  import VueNotifications from 'vue-notifications';

  export default {
    name: "scraping-ico-form",
    props: {
      ico: {
        type: Object,
        required: false,
        default: () => {}
      }
    },
    components: {
      Multiselect
    },
    data() {
      return {
        countries: this.$store.state.scrapingICOs.countries,
        regions: this.$store.state.scrapingICOs.regions,
        categories: this.$store.state.scrapingICOs.categories,
        formModel: {
          id: null,
          name: "",
          website: "",
          resources: [],
          resourcesOpt: [],
          maininfo: {
            description: "",
            intro: "",
            about: "",
            country: "",
            region: "",
            company: ""
          },
          finance: {
            token: "",
            category: "",
            tokenType: "",
            totalTokens: -1,
            saleTokens: -1,
            salePercent: -1,
            price: -1,
            accepting: "",
            tokensRole: "",
            dividends: "",
            emission: "",
            escrow: "",
            totalMoney: -1,
            hardcap: -1,
            softcap: -1,
            distributed: -1,
            bonus: false,
            platform: ""
          },
          dates: {
            preIcoStart: null,
            preIcoEnd: null,
            icoStart: null,
            icoEnd: null
          },
          team: {
            members: "",
            from: "",
            size: -1
          },
          links: {
            whitepaper: "",
            twitter: "",
            telegram: "",
            medium: "",
            slack: "",
            reddit: "",
            linkedin: "",
            facebook: "",
            github: "",
            crunchbase: "",
            bitcointalk: "",
            youtube: ""
          },
          features: {
            content: "",
            techDetails: ""
          },
          bounty: {
            link: "",
            scheme: ""
          },
          wallets: {
            btc: "",
            eth: ""
          },
          milestones: "",
          distribution: "",
          additionalLinks: "{}",
          screenShorts: "{}",
          rating: {
            icodrops: {
              totalrate: "",
              hyperate: "",
              riskrate: "",
              roirate: ""
            },
            icobench: {
              total: "",
              profile: "",
              team: "",
              vision: "",
              product: ""
            },
            icobazaar: {
              total: "",
              site: "",
              team: "",
              idea: "",
              media: "",
              technology: ""
            },
            icorating: {
              investment: "",
              hypescore: "",
              riskscore: ""
            },
            ventanalytics: {
              p_hardcap: -1
            }
          },
          timestamp: new Date().toISOString()
        }
      }
    },
    mounted () {
      if (this.ico && this.ico.name) {
        this.setData()
      }
    },
    methods: {
      setData () {
        this.formModel = {
            id: this.ico.id,
            name: this.ico.name,
            website: this.ico.website,
            resources: this.ico.resources,
            resourcesOpt: this.ico.resources,
            maininfo: {
              description: this.ico.maininfo.description,
              intro: this.ico.maininfo.intro,
              about: this.ico.maininfo.about,
              country: this.ico.maininfo.country,
              region: this.ico.maininfo.region,
              company: this.ico.maininfo.company
            },
            finance: {
              token: this.ico.finance.token,
              category: this.ico.finance.category,
              tokenType: this.ico.finance.tokenType,
              totalTokens: this.ico.finance.totalTokens,
              saleTokens: this.ico.finance.saleTokens,
              salePercent: this.ico.finance.salePercent,
              price: this.ico.finance.price,
              accepting: this.ico.finance.accepting,
              tokensRole: this.ico.finance.tokensRole,
              dividends: this.ico.finance.dividends,
              emission: this.ico.finance.emission,
              escrow: this.ico.finance.escrow,
              totalMoney: this.ico.finance.totalMoney,
              hardcap: this.ico.finance.hardcap,
              softcap: this.ico.finance.softcap,
              distributed: this.ico.finance.distributed,
              bonus: this.ico.finance.bonus,
              platform: this.ico.finance.platform
            },
            dates: {
              preIcoStart: this.ico.dates.preIcoStart,
              preIcoEnd: this.ico.dates.preIcoEnd,
              icoStart: this.ico.dates.icoStart,
              icoEnd: this.ico.dates.icoEnd
            },
            team: {
              members: this.ico.team.members,
              from: this.ico.team.from,
              size: this.ico.team.size
            },
            links: {
              whitepaper: this.ico.links.whitepaper,
              twitter: this.ico.links.twitter,
              telegram: this.ico.links.telegram,
              medium: this.ico.links.medium,
              slack: this.ico.links.slack,
              reddit: this.ico.links.reddit,
              linkedin: this.ico.links.linkedin,
              facebook: this.ico.links.facebook,
              github: this.ico.links.github,
              crunchbase: this.ico.links.crunchbase,
              bitcointalk: this.ico.links.bitcointalk,
              youtube: this.ico.links.youtube
            },
            features: {
              content: this.ico.features.content,
              techDetails: this.ico.features.techDetails
            },
            bounty: {
              link: this.ico.bounty.link,
              scheme: this.ico.bounty.scheme
            },
            wallets: {
              btc: this.ico.wallets ? this.ico.wallets.btc : "",
              eth: this.ico.wallets ? this.ico.wallets.eth : ""
            },
            milestones: this.ico.milestones,
              distribution: this.ico.distribution,
              additionalLinks: this.ico.additionalLinks,
              screenShorts: this.ico.screenShorts,
              rating: {
              icodrops: {
                totalrate: this.ico.rating.icodrops.totalrate,
                hyperate: this.ico.rating.icodrops.hyperate,
                riskrate: this.ico.rating.icodrops.riskrate,
                roirate: this.ico.rating.icodrops.roirate
              },
              icobench: {
                total: this.ico.rating.icobench.total,
                profile: this.ico.rating.icobench.profile,
                team: this.ico.rating.icobench.team,
                vision: this.ico.rating.icobench.vision,
                product: this.ico.rating.icobench.product
              },
              icobazaar: {
                total: this.ico.rating.icobazaar.total,
                site: this.ico.rating.icobazaar.size,
                team: this.ico.rating.icobazaar.team,
                idea: this.ico.rating.icobazaar.idea,
                media: this.ico.rating.icobazaar.media,
                technology: this.ico.rating.icobazaar.technology
              },
              icorating: {
                investment: this.ico.rating.icorating.investment,
                hypescore: this.ico.rating.icorating.hypescore,
                riskscore: this.ico.rating.icorating.riskscore
              },
              ventanalytics: {
                p_hardcap: this.ico.rating.ventanalytics.p_hardcap
              }
            },
            timestamp: this.ico.timestamp
          }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((result) => {
          if (result) {
            if (this.ico && this.ico.name) {
              this.$store.dispatch('scrapingICOs/update', this.formModel)
            } else {
              this.$store.dispatch('scrapingICOs/create', this.formModel)
            }
          } else {
            VueNotifications.warn({title: "Complete form"});
          }
        })
      },
      addResource (resource) {
        this.formModel.resources.push({
          name: resource,
          code: resource
        });
      },
      setRegion (element) {
        for (let i in this.countries) {
          if (this.countries[i].countries.indexOf(element) !== -1)
            this.formModel.maininfo.region = this.countries[i].region;
        }
      }
    }
  }
</script>
