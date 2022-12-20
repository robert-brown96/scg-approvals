/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(["N/email", "N/render"], (email, render) => {
    /**
     * Defines the WorkflowAction script trigger point.
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.workflowId - Internal ID of workflow which triggered this action
     * @param {string} context.type - Event type
     * @param {Form} context.form - Current form that the script uses to interact with the record
     * @since 2016.1
     */
    const onAction = context => {
        try {
            let senderId;
            let recipientEmail;
            let recipientId;
            let fileObjs = [];
            let transactionId;
            let entityId;
            let templateId;

            const mergeResult = render.mergeEmail({
                templateId,
                transactionId,
                entityId
            });

            email.send({
                author: senderId,
                recipients: recipientEmail,
                subject: mergeResult.subject,
                body: mergeResult.body,
                attachments: fileObjs
            });
        } catch (e) {
            log.error({
                title: "onAction: ERROR",
                details: e
            });
        }
    };

    return { onAction };
});
