import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Accounts from '../Table/Accounts';
import Campaigns from '../Table/Campaigns';
import AdSets from '../Table/AdSets';
import AdSetsFiltered from '../Table/AdSetsFiltered';
import Ads from '../Table/Ads';
import AdsFiltered from '../Table/AdsFiltered';
import GeneralReport from '../Table/GeneralReport';
import { AccountsDataStore } from '../../data/AccountsDataStore';
import { CampaignsDataStore } from '../../data/CampaignsDataStore';
import { AdSetsDataStore } from '../../data/AdSetsDataStore';
import { AdsDataStore } from '../../data/AdsDataStore';
import GoogleCampaignsTable from '../Table/GCampaigns';
import GoogleAdGroupsTable from '../Table/GAdGroups';
import GoogleAdsTable from '../Table/GAds';
import './MainDash.css';

// prettier-ignore
const MainDash = () => {
  return (
    <div className="MainDash">
      <Routes>
        <Route path="/" element={<AccountsDataStore><Accounts /></AccountsDataStore>}/>
        <Route path="/accounts" element={<AccountsDataStore><Accounts /></AccountsDataStore>}/>
        <Route path="/campaigns" element={<CampaignsDataStore><Campaigns /></CampaignsDataStore>}/>
        <Route path="/ad-sets" element={<AdSetsDataStore><AdSets /></AdSetsDataStore>}/>
        <Route path="/ad-sets/:campaign_id" element={<AdSetsDataStore><AdSetsFiltered /></AdSetsDataStore>}/>
        <Route path="/ads" element={<AdsDataStore><Ads /></AdsDataStore>}/>
        <Route path="/ads/:adset_id" element={<AdsDataStore><AdsFiltered /></AdsDataStore>}/>
        <Route path="/general-report" element={<CampaignsDataStore><GeneralReport /></CampaignsDataStore>}/>
        <Route path="/google-campaigns" element={<GoogleCampaignsTable />}/>
        <Route path="/google-ad_groups" element={<GoogleAdGroupsTable />}/>
        <Route path="/google-ads" element={<GoogleAdsTable />}/>
      </Routes>
    </div>
  );
};

export default MainDash;
