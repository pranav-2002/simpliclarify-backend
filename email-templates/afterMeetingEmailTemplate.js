export default function (
    userName,
    date,
    startTime,
    endTime,
    mentorName,
    bookingId
) {
    // const BASE_URL = "http://localhost:8080";
    const BASE_URL = 'https://dev-sc-dev.netlify.app';
    // return `, Link is
    // http://localhost:8080/feedback?bookingid=${bookingId}&date=${date}&mentor=${mentorName}`;
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>
            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <!--<![endif]-->
            <title></title>
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css">
            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
            <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css">
            <!--<![endif]-->
            <style type="text/css">
                body {
                    margin: 0;
                    padding: 0;
                }

                table,
                td,
                tr {
                    vertical-align: top;
                    border-collapse: collapse;
                }

                * {
                    line-height: inherit;
                }

                a[x-apple-data-detectors=true] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
            </style>
            <style type="text/css" id="media-query">
                @media (max-width: 670px) {

                    .block-grid,
                    .col {
                        min-width: 320px !important;
                        max-width: 100% !important;
                        display: block !important;
                    }

                    .block-grid {
                        width: 100% !important;
                    }

                    .col {
                        width: 100% !important;
                    }

                    .col_cont {
                        margin: 0 auto;
                    }

                    img.fullwidth,
                    img.fullwidthOnMobile {
                        max-width: 100% !important;
                    }

                    .no-stack .col {
                        min-width: 0 !important;
                        display: table-cell !important;
                    }

                    .no-stack.two-up .col {
                        width: 50% !important;
                    }

                    .no-stack .col.num2 {
                        width: 16.6% !important;
                    }

                    .no-stack .col.num3 {
                        width: 25% !important;
                    }

                    .no-stack .col.num4 {
                        width: 33% !important;
                    }

                    .no-stack .col.num5 {
                        width: 41.6% !important;
                    }

                    .no-stack .col.num6 {
                        width: 50% !important;
                    }

                    .no-stack .col.num7 {
                        width: 58.3% !important;
                    }

                    .no-stack .col.num8 {
                        width: 66.6% !important;
                    }

                    .no-stack .col.num9 {
                        width: 75% !important;
                    }

                    .no-stack .col.num10 {
                        width: 83.3% !important;
                    }

                    .video-block {
                        max-width: none !important;
                    }

                    .mobile_hide {
                        min-height: 0px;
                        max-height: 0px;
                        max-width: 0px;
                        display: none;
                        overflow: hidden;
                        font-size: 0px;
                    }

                    .desktop_hide {
                        display: block !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>

        <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #000000;">
            <!--[if IE]><div class="ie-browser"><![endif]-->
            <table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="#000000" valign="top">
                <tbody>
                    <tr style="vertical-align: top;" valign="top">
                        <td style="word-break: break-word; vertical-align: top;" valign="top">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#000000"><![endif]-->
                            <div style="background-color:#fdffd1;">
                                <div class="block-grid " style="min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdffd1;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                        <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                            <div class="col_cont" style="width:100% !important;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                    <!--<![endif]-->
                                                    <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                                                                <h1 style="color:#555555;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;"></h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
                            <div style="background-color:#fdffd1;">
                                <div class="block-grid " style="min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #ffffff;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;background-image:url('https://firebasestorage.googleapis.com/v0/b/simpliclarify-user-portal.appspot.com/o/SC-Portal%2FEmail%20Templates%2FFeedback%2Fyelloww%20arrow.png?alt=media&token=66a778ed-4ff3-458d-bb82-dc7dd410e6c7');background-position:top left;background-repeat:no-repeat">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdffd1;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#ffffff;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:45px; padding-bottom:0px;"><![endif]-->
                                        <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                            <div class="col_cont" style="width:100% !important;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:45px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                    <!--<![endif]-->
                                                    <div class="img-container right fixedwidth" align="right" style="padding-right: 20px;padding-left: 0px;">
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 20px;padding-left: 0px;" align="right"><![endif]--><img class="right fixedwidth" align="right" border="0" src="https://firebasestorage.googleapis.com/v0/b/simpliclarify-user-portal.appspot.com/o/SC-Portal%2Flogo.png?alt=media&token=3b945e02-c2ec-4580-8b74-b9766dcc1e1c" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 163px; float: none; display: block;" width="163">
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                    <div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                        <div class="txtTinyMce-wrapper" style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                            <p style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">&nbsp;</p>
                                                        </div>
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                    <div class="img-container left fixedwidth" align="left" style="padding-right: 20px;padding-left: 10px;">
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 20px;padding-left: 10px;" align="left"><![endif]-->
                                                        <div style="font-size:1px;line-height:20px">&nbsp;</div><img class="left fixedwidth" border="0" src="https://firebasestorage.googleapis.com/v0/b/simpliclarify-user-portal.appspot.com/o/SC-Portal%2FEmail%20Templates%2FFeedback%2FFeedback.png?alt=media&token=268fdf1c-1c8d-4d07-b8ea-473632445407" alt="Forgot your password?" title="Forgot your password?" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 358px; display: block;" width="358">
                                                        <div style="font-size:1px;line-height:5px">&nbsp;</div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </div>
                                                    <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 35px; padding-right: 0px; padding-top: 20px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                                                                <h1 style="color:#949600;direction:ltr;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:28px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;">How did your meeting with ${mentorName} go?</h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 45px; padding-left: 35px; padding-top: 20px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                    <div style="color:#949600;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.5;padding-top:20px;padding-right:45px;padding-bottom:0px;padding-left:35px;">
                                                        <div class="txtTinyMce-wrapper" style="line-height: 1.5; font-size: 12px; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #949600; mso-line-height-alt: 18px;">
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; text-align: left; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">Hello ${userName},</p>
                                                        </div>
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 45px; padding-left: 35px; padding-top: 20px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                    <div style="color:#949600;font-family:'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.5;padding-top:20px;padding-right:45px;padding-bottom:0px;padding-left:35px;">
                                                        <div class="txtTinyMce-wrapper" style="line-height: 1.5; font-size: 12px; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #949600; mso-line-height-alt: 18px;">
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">Hope Probuddy helped you SimpliFy your queries and ClariFy your doubts. It would be great if you could take out some time and fill up a short feedback form so we serve you better. &nbsp;</p>
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">&nbsp;</p>
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">Booking ID:<strong> ${bookingId}</strong></p>
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">&nbsp;</p>
                                                            <p style="margin: 0; line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">Mentor Name: ${mentorName}<br>Meeting scheduled on: <strong>${date}</strong><br>Meeting scheduled from: <strong>${startTime}-${endTime} (IST)</strong></p>
                                                        </div>
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                    <div class="button-container" align="center" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${BASE_URL}/feedback?bookingid=${bookingId}&date=${date}&mentor=${mentorName}" style="height:40.5pt;width:255pt;v-text-anchor:middle;" arcsize="0%" strokeweight="0.75pt" strokecolor="#949600" fillcolor="#949600"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="${BASE_URL}/feedback?bookingid=${bookingId}&date=${date}&mentor=${mentorName}" target="_blank" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #949600; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #949600; border-right: 1px solid #949600; border-bottom: 1px solid #949600; border-left: 1px solid #949600; padding-top: 10px; padding-bottom: 10px; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:undefined;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong>Yay! I'll give a feedback</strong></span></span></a>
                                                        <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                    </div>
                                                    <table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
                                                        <tbody>
                                                            <tr style="vertical-align: top;" valign="top">
                                                                <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 30px; padding-bottom: 20px; padding-left: 30px;" valign="top">
                                                                    <table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="80%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #949600; width: 80%;" align="center" role="presentation" valign="top">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top;" valign="top">
                                                                                <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 10px; padding-right: 10px; padding-top: 0px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                                                                <h3 style="color:#949600;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:13px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">If you have any queries regarding the meeting, write to us at <strong>probuddy.tech@gmail.com</strong></h3>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td style="word-break: break-word; vertical-align: top; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; padding-top: 10px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                                                                <h1 style="color:#555555;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:200%;text-align:center;margin-top:0;margin-bottom:0;"></h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
                            <div style="background-color:#fdffd1;">
                                <div class="block-grid " style="min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdffd1;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                        <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                            <div class="col_cont" style="width:100% !important;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                    <!--<![endif]-->
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                    <div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                        <div class="txtTinyMce-wrapper" style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                            <p style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;"><a href="https://probuddy.in/" target="_blank" style="text-decoration: underline; color: #1d2fb5;" rel="noopener"><span style="font-size: 15px;">https://probuddy.in</span></a></p>
                                                        </div>
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                    <table class="social_icons" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                                        <tbody>
                                                            <tr style="vertical-align: top;" valign="top">
                                                                <td style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                    <table class="social_table" align="center" cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;" valign="top">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top; display: inline-block; text-align: center;" align="center" valign="top">
                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 2.5px; padding-left: 2.5px;" valign="top"><a href="https://www.facebook.com/Simpliclarify-106300028306009" target="_blank"><img width="32" height="32" src="https://firebasestorage.googleapis.com/v0/b/simpliclarify-user-portal.appspot.com/o/SC-Portal%2FEmail%20Templates%2FEmail%20Verification%2Ffacebook2x.png?alt=media&token=10facd07-f5c9-4f37-a44a-035f04dd68e7" alt="Facebook" title="facebook" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 2.5px; padding-left: 2.5px;" valign="top"><a href="https://www.instagram.com/simpliclarify/?igshid=1acex1sadsk6y" target="_blank"><img width="32" height="32" src="https://firebasestorage.googleapis.com/v0/b/simpliclarify-user-portal.appspot.com/o/SC-Portal%2FEmail%20Templates%2FEmail%20Verification%2Finstagram2x.png?alt=media&token=ab49e5f5-a72a-48d4-a481-f45c9ec01b25" alt="Instagram" title="Instagram" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--[if (IE)]></div><![endif]-->
        </body>

        </html>
    `;
}
