/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const DCServicesSdk = require('@adobe/dc-services-node-sdk'),
    fs = require('fs');

/**
 * This sample illustrates how to create a PDF file from a DOCX file, and then write the result to an output stream.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */


/**
 * Prepares a writeStream over a predetermined result file.
 */
const prepareWriteStream = () => {
    // create output directory if it doesn't exists.
    if (!fs.existsSync('output')) {
        console.log('Creating output directory');
        fs.mkdirSync('output');
    }

    return fs.createWriteStream('output/createPDFAsStream.pdf');
};

try {
    // Initial setup, create a ClientContext using a config file, and a new operation instance.
    const clientContext = DCServicesSdk.ClientContext.createFromFile('dc-services-sdk-config.json'),
        createPdfOperation = DCServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = DCServicesSdk.FileRef.createFromLocalFile('resources/createPDFInput.docx');
    createPdfOperation.setInput(input);

    const writeStream = prepareWriteStream();

    // Execute the operation and Write the result to stream.
    createPdfOperation.execute(clientContext)
        .then(result => result.writeToStream(writeStream))
        .catch(err => console.log('Exception encountered while executing operation', err));
} catch (err) {
    console.log('Exception encountered while executing operation', err);
}