/**
 * @NApiVersion 2.1
 */
define([], () => {
     const exports = {};
     exports.TRAN_BODY_FIELDS = {
          BUSINESS_OWNER: "custbody_scg_approval_bo",
          APPROVAL_STAGE: "custbody_scg_approval_s_hide",
          LAST_EMAIL_DATE: "custbody_scg_approval_last_email_date",
          LAST_EMAIL_ERROR: "custbody_scg_approval_last_email_error"
     };

     exports.APPROVAL_CONFIG = {
          recordtype: "customrecord_scg_approval_config",
          fields: {
               WF: "custrecord_scg_ac_workflow",
               EXTERNAL_URL: "custrecord_scg_ac_url",
               APPROVED_TEMPLATE: "custrecord_scg_ac_approved"
          }
     };

     exports.APPROVAL_STAGE = {
          recordtype: "customrecord_scg_approval_rule",
          fields: {
               CONFIG: "custrecord_scg_as_config",
               APPROVERS: "custrecord_scg_as_approvers",
               MIN_AMOUNT: "custrecord_scg_as_min",
               APPROVER_AMOUNT_BASED: "custrecord_scg_as_approveramount",
               FINAL: "custrecord_scg_as_final",
               SORT: "custrecord_scg_as_order",
               SENDER: "custrecord_scg_as_sender",
               REJECT_TEMPLATE: "custrecord_scg_as_template",
               PENDING_TEMPLATE: "custrecord_scg_as_email_template"
          }
     };

     return exports;
});
