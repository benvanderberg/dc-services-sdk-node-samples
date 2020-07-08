/*
* Copyright 2020 Adobe
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
*/

const DCServicesSdk = require('@adobe/dc-services-node-sdk');

/**
* Sets any custom options for the operation.
*
* @param htmlToPDFOperation operation instance for which the options are provided.
*/
const setCustomOptions = (htmlToPDFOperation) => {
    // Define the page layout, in this case an 8 x 11.5 inch page (effectively portrait orientation).
    const pageLayout = new DCServicesSdk.CreatePDF.options.PageLayout();
    pageLayout.setPageSize(8, 11.5);
    
    
    
    //Set the dataToMerge field that needs to be populated in the HTML before its conversion.
    const dataToMerge = {
        "invoiceNo":"123456",
        "invoiceDate":"07/07/2020",
        "terms":"NET 60",
        "billTo":"John Smith",
        "dueDate":"09/30/2020",
        "name":"John Smith",
        "email":"johnsmith@example.com",
        "street":"111 Anderson Ave",
        "city":"Seattle",
        "state":"WA",
        "taxRatePercentage":8,
        "paid":234,
        "zip":"98123",
        "services":[
            {
                "description":"Bodea Cloud Services",
                "quantity":40,
                "rate":95.00
            },
            {
                "description":"Professional Services",
                "quantity":23,
                "rate":150.00
            }
        ]
    };
    // Set the desired HTML-to-PDF conversion options.
    const htmlToPdfOptions = new DCServicesSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
    .includesHeaderFooter(true)
    .withPageLayout(pageLayout)
    .withDataToMerge(dataToMerge)
    .build();
    htmlToPDFOperation.setOptions(htmlToPdfOptions);
};


try {
    // Initial setup, create credentials instance.
    const credentials =  DCServicesSdk.Credentials
    .serviceAccountCredentialsBuilder()
    .fromFile("dc-services-sdk-credentials.json")
    .build();
    
    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = DCServicesSdk.ExecutionContext.create(credentials),
    htmlToPDFOperation = DCServicesSdk.CreatePDF.Operation.createNew();
    
    // Set operation input from a source file.
    
    const input = DCServicesSdk.FileRef.createFromLocalFile('resources/invoiceTemplate.zip');
    htmlToPDFOperation.setInput(input);
    
    // Provide any custom configuration options for the operation.
    setCustomOptions(htmlToPDFOperation);
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+(today.getHours())+(today.getMinutes())+(today.getSeconds());


    // Execute the operation and Save the result to the specified location.
    htmlToPDFOperation.execute(executionContext)
    .then(result => result.saveAsFile('output/invoice-'+date+'.pdf'))
    .catch(err => {
        if(err instanceof DCServicesSdk.Error.ServiceApiError
            || err instanceof DCServicesSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
            } else {
                console.log('Exception encountered while executing operation', err);
            }
        });
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
    