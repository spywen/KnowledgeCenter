﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace KnowledgeCenter.Common.Exceptions {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class ErrorResources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal ErrorResources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("KnowledgeCenter.Common.Exceptions.ErrorResources", typeof(ErrorResources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This agency already exists: same name or same postal code..
        /// </summary>
        public static string AGENCY_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("AGENCY_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This agency is linked to at least one user. You can&apos;t delete it..
        /// </summary>
        public static string AGENCY_LINKEDWITHUSER {
            get {
                return ResourceManager.GetString("AGENCY_LINKEDWITHUSER", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This collaborator already has this skill..
        /// </summary>
        public static string COLLABORATOR_ALREADY_HAS_SKILL {
            get {
                return ResourceManager.GetString("COLLABORATOR_ALREADY_HAS_SKILL", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to A collaborator with the same email already exists: {0}.
        /// </summary>
        public static string COLLABORATOR_ALREADYEXISTS_EMAIL {
            get {
                return ResourceManager.GetString("COLLABORATOR_ALREADYEXISTS_EMAIL", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to A collaborator with the same GGID already exists: {0}.
        /// </summary>
        public static string COLLABORATOR_ALREADYEXISTS_GGID {
            get {
                return ResourceManager.GetString("COLLABORATOR_ALREADYEXISTS_GGID", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to A customer with the same name already exists..
        /// </summary>
        public static string CUSTOMER_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("CUSTOMER_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This customer offer already has this skill..
        /// </summary>
        public static string CUSTOMEROFFER_ALREADY_HAS_SKILL {
            get {
                return ResourceManager.GetString("CUSTOMEROFFER_ALREADY_HAS_SKILL", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The mission end date can not be earlier than mission start date..
        /// </summary>
        public static string CUSTOMEROFFER_MISSIONENDDATE_EARLIERTHAN_MISSIONSSTARTDATE {
            get {
                return ResourceManager.GetString("CUSTOMEROFFER_MISSIONENDDATE_EARLIERTHAN_MISSIONSSTARTDATE", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The priority can not have a value below zero..
        /// </summary>
        public static string CUSTOMEROFFERSKILL_INVALID_PRIORITY {
            get {
                return ResourceManager.GetString("CUSTOMEROFFERSKILL_INVALID_PRIORITY", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to An other customer offer skill already is assigned to that priority..
        /// </summary>
        public static string CUSTOMEROFFERSKILL_PRIORITY_ALREADY_ASSIGNED {
            get {
                return ResourceManager.GetString("CUSTOMEROFFERSKILL_PRIORITY_ALREADY_ASSIGNED", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to A customer site with the same name already exists..
        /// </summary>
        public static string CUSTOMERSITE_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("CUSTOMERSITE_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to System cannot send anymore emails for now. Do not hesitate to contact support if necessary..
        /// </summary>
        public static string EMAIL_LIMIT_REACHED {
            get {
                return ResourceManager.GetString("EMAIL_LIMIT_REACHED", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to à No entity was found for the id you provided..
        /// </summary>
        public static string ENTITY_NOTFOUND {
            get {
                return ResourceManager.GetString("ENTITY_NOTFOUND", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid operation. Please contact administrator if problem persists..
        /// </summary>
        public static string INVALID_ACTION {
            get {
                return ResourceManager.GetString("INVALID_ACTION", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid operation. You are not authorized to proceed to this action..
        /// </summary>
        public static string INVALID_OPERATION {
            get {
                return ResourceManager.GetString("INVALID_OPERATION", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to You tried too connect too many times; now your account is blocked. Please contact administrator..
        /// </summary>
        public static string LOGIN_ACCOUNTBLOCKED {
            get {
                return ResourceManager.GetString("LOGIN_ACCOUNTBLOCKED", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid login or password ;) Please try again!.
        /// </summary>
        public static string LOGIN_INVALIDCREDENTIALS {
            get {
                return ResourceManager.GetString("LOGIN_INVALIDCREDENTIALS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Your password is incorrect. {0} tries are remaining after your account will be blocked..
        /// </summary>
        public static string LOGIN_REMAININGTRY {
            get {
                return ResourceManager.GetString("LOGIN_REMAININGTRY", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to No account found for this email address. Please provide valid email address or sign in to the portal with this new address..
        /// </summary>
        public static string RECOVERPASSWORD_UNRECOGNIZEDEMAIL {
            get {
                return ResourceManager.GetString("RECOVERPASSWORD_UNRECOGNIZEDEMAIL", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This service line already exists..
        /// </summary>
        public static string SERVICELINE_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("SERVICELINE_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This Service Line is linked to at least one user. You can&apos;t delete it..
        /// </summary>
        public static string SERVICELINE_LINKEDWITHUSER {
            get {
                return ResourceManager.GetString("SERVICELINE_LINKEDWITHUSER", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid account activation token provided..
        /// </summary>
        public static string SIGNIN_ACTIVATION_INVALIDTOKEN {
            get {
                return ResourceManager.GetString("SIGNIN_ACTIVATION_INVALIDTOKEN", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Login or email already used..
        /// </summary>
        public static string SIGNIN_ALREADYEXIST {
            get {
                return ResourceManager.GetString("SIGNIN_ALREADYEXIST", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This skill already exists..
        /// </summary>
        public static string SKILL_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("SKILL_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This skill cannot be deleted because it is linked to at least one user..
        /// </summary>
        public static string SKILL_LINKEDTOCOLLABORATOR {
            get {
                return ResourceManager.GetString("SKILL_LINKEDTOCOLLABORATOR", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This skill level already exists..
        /// </summary>
        public static string SKILLLEVEL_ALREADYEXISTS {
            get {
                return ResourceManager.GetString("SKILLLEVEL_ALREADYEXISTS", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Sorry but system seems to be too busy for now. Please try later..
        /// </summary>
        public static string SYSTEM_BUSY {
            get {
                return ResourceManager.GetString("SYSTEM_BUSY", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Token issue occured: {0}.
        /// </summary>
        public static string TOKEN_ISSUE {
            get {
                return ResourceManager.GetString("TOKEN_ISSUE", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Unexpected error occured. If problem persists, please contact administrator..
        /// </summary>
        public static string UNKNOWN {
            get {
                return ResourceManager.GetString("UNKNOWN", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid ADMIN old password provided. Please provide YOUR admin password to change password of another account..
        /// </summary>
        public static string USER_ADMIN_INVALIDADMINPASSWORD {
            get {
                return ResourceManager.GetString("USER_ADMIN_INVALIDADMINPASSWORD", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid old password provided..
        /// </summary>
        public static string USER_INVALIDOLDPASSWORD {
            get {
                return ResourceManager.GetString("USER_INVALIDOLDPASSWORD", resourceCulture);
            }
        }
    }
}
