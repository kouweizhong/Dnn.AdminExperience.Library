import util from "../utils";
function serializeQueryStringParameters(obj) {
    let s = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            s.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return s.join("&");
}
class ApplicationService {
    getServiceFramework(controller) {
        let sf = util.utilities.sf;

        sf.moduleRoot = "PersonaBar/Admin";
        sf.controller = controller;

        return sf;
    }

    getGeneralSettings(callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("GetGeneralSettings", {}, callback);
    }    

    updateGeneralSettings(payload, callback, failureCallback) {
        const sf = this.getServiceFramework("SEO");
        sf.post("UpdateGeneralSettings", payload, callback, failureCallback);
    }

    getRegexSettings(callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("GetRegexSettings", {}, callback);
    }    

    updateRegexSettings(payload, callback, failureCallback) {
        const sf = this.getServiceFramework("SEO");
        sf.post("UpdateRegexSettings", payload, callback, failureCallback);
    }

    testUrl(pageId, queryString, customPageName, callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("TestUrl?pageId=" + pageId + "&queryString=" + encodeURIComponent(queryString) + "&customPageName=" + encodeURIComponent(customPageName), {}, callback);
    }   

    testUrlRewrite(uri, callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("TestUrlRewrite?uri=" + uri, {}, callback);
    }  
    
    getSitemapSettings(callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("GetSitemapSettings", {}, callback);
    }    

    updateSitemapSettings(payload, callback, failureCallback) {
        const sf = this.getServiceFramework("SEO");
        sf.post("UpdateSitemapSettings", payload, callback, failureCallback);
    }

    getProviders(callback) {
        const sf = this.getServiceFramework("SEO");        
        sf.get("GetProviders", {}, callback);
    }    

    updateProvider(payload, callback, failureCallback) {
        const sf = this.getServiceFramework("SEO");
        sf.post("updateProvider", payload, callback, failureCallback);
    }

    clearCache(callback, failureCallback) {
        const sf = this.getServiceFramework("SEO");
        sf.post("ResetCache", {}, callback, failureCallback);
    }
}
const applicationService = new ApplicationService();
export default applicationService;