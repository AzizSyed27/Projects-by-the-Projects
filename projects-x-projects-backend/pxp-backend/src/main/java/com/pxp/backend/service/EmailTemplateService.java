package com.pxp.backend.service;

import com.pxp.backend.entity.Event;
import com.pxp.backend.entity.Project;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class EmailTemplateService {

  @Value("${pxp.site-url}") private String siteUrl;
  @Value("${pxp.api-public-url}") private String apiPublicUrl;

  @Value("${pxp.mail.logo-url}") private String logoUrl;
  @Value("${pxp.mail.support-email}") private String supportEmail;
  @Value("${pxp.mail.org-name}") private String orgName;
  @Value("${pxp.mail.org-location}") private String orgLocation;

  private String noSlash(String s){ return s != null && s.endsWith("/") ? s.substring(0, s.length()-1) : s; }

  public record EmailContent(String subject, String textBody, String htmlBody, String listUnsubscribe) {}

  // --- Templates ---

  public EmailContent subscriptionVerify(String verifyUrl, String unsubscribeUrl) {
    String subject = orgName + " — Confirm your subscription";

    String text =
      "Hello,\n\n" +
      "Please confirm your subscription to " + orgName + " updates:\n" +
      verifyUrl + "\n\n" +
      "What you'll receive:\n" +
      "- New projects & updates\n" +
      "- Local event announcements\n\n" +
      "If you didn’t request this, you can ignore this email.\n\n" +
      "Unsubscribe:\n" + unsubscribeUrl + "\n\n" +
      orgName + " • " + orgLocation + "\n" +
      "Support: " + supportEmail + "\n";

    String html = layout(
      "Confirm your subscription",
      "Please confirm your subscription to <b>" + esc(orgName) + "</b> updates.",
      button("Confirm subscription", verifyUrl),
      infoList(new String[]{
        "New project announcements and updates",
        "Local event notifications",
        "Occasional impact stories"
      }),
      footer(unsubscribeUrl)
    );

    return new EmailContent(subject, text, html, unsubscribeUrl);
  }

  public EmailContent newProject(Project project, String unsubscribeUrl) {
    String subject = orgName + " — New project underway: " + project.getTitle();
    String projectUrl = noSlash(siteUrl) + "/projects/" + project.getSlug();

    String tags = "";
    String raw = project.getProjectTags();

    if (raw != null && !raw.trim().isEmpty()) {
      tags = Arrays.stream(raw.split(","))
          .map(String::trim)
          .filter(s -> !s.isEmpty())
          .collect(Collectors.joining(", "));
    }

    String text =
      "Hello,\n\n" +
      "A new project is underway:\n" +
      project.getTitle() + "\n\n" +
      (project.getHeroBlurb() != null ? project.getHeroBlurb() + "\n\n" : "") +
      (project.getShortDesc() != null ? project.getShortDesc() + "\n\n" : "") +
      (tags.isBlank() ? "" : "" + tags + "\n\n") +
      "View project:\n" + projectUrl + "\n\n" +
      "Unsubscribe:\n" + unsubscribeUrl + "\n\n" +
      orgName + " • " + orgLocation + "\n" +
      "Support: " + supportEmail + "\n";

    String details = "";
    if (!tags.isBlank()) details += pillRow("Tags", esc(tags));
    if (project.getHeroBlurb() != null && !project.getHeroBlurb().isBlank()) details += para(esc(project.getHeroBlurb()));
    if (project.getShortDesc() != null && !project.getShortDesc().isBlank()) details += para(esc(project.getShortDesc()));

    String heroImg = (project.getCardImageUrl() != null && !project.getCardImageUrl().isBlank())
      ? image(project.getCardImageUrl())
      : "";

    String html = layout(
      "New project underway",
      "We’ve started a new project: <b>" + esc(project.getTitle()) + "</b>.",
      heroImg + details + button("View project", projectUrl),
      "",
      footer(unsubscribeUrl)
    );

    return new EmailContent(subject, text, html, unsubscribeUrl);
  }

  public EmailContent upcomingEvent(Event event, String unsubscribeUrl) {
    String subject = orgName + " — Upcoming event: " + event.getTitle();

    String dateStr = event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
    String where = (event.getLocation() == null || event.getLocation().isBlank()) ? "Location TBD" : event.getLocation();

    // cards only → send them to your Events section/page
    String viewLink = noSlash(siteUrl) + "/projects/#events";

    String text =
      "Hello,\n\n" +
      "Upcoming event:\n" +
      event.getTitle() + "\n" +
      dateStr + "\n" +
      where + "\n\n" +
      (event.getShortDesc() != null ? event.getShortDesc() + "\n\n" : "") +
      "See details:\n" + viewLink + "\n\n" +
      "Unsubscribe:\n" + unsubscribeUrl + "\n\n" +
      orgName + " • " + orgLocation + "\n" +
      "Support: " + supportEmail + "\n";

    String heroImg = (event.getImageUrl() != null && !event.getImageUrl().isBlank())
      ? image(event.getImageUrl())
      : "";

    String html = layout(
      "Upcoming event",
      "<b>" + esc(event.getTitle()) + "</b><br/>" + esc(dateStr) + " • " + esc(where),
      heroImg + (event.getShortDesc() != null ? para(esc(event.getShortDesc())) : "") + button("View events", viewLink),
      "",
      footer(unsubscribeUrl)
    );

    return new EmailContent(subject, text, html, unsubscribeUrl);
  }

  // --- HTML helpers (email-safe table layout, inline styles) ---

  private String layout(String title, String intro, String mainHtml, String extrasHtml, String footerHtml) {
    String preheader = "Updates from " + esc(orgName);
    
    

    return """
		<!doctype html>
		<html>
		  <body style="margin:0;padding:0;background:#f3fbfb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
		    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">%s</span>
		    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">
		      <tr>
		        <td align="center">
		          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">
		            <tr>
		              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">
		                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
		                  <tr>
		                    <td style="vertical-align:middle;">
		                      %s
		                    </td>
		                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">
		                      %s
		                    </td>
		                  </tr>
		                </table>
		              </td>
		            </tr>
		
		            <tr>
		              <td style="padding:22px 20px;color:#0f172a;">
		                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">%s</div>
		                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">%s</div>
		                <div style="margin-top:16px;">%s</div>
		                %s
		              </td>
		            </tr>
		
		            <tr>
		              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">
		                %s
		              </td>
		            </tr>
		          </table>
		
		          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">
		            You’re receiving this because you signed up on %s.
		          </div>
		        </td>
		      </tr>
		    </table>
		  </body>
		</html>
	""".formatted(
      preheader,
      (logoUrl != null && !logoUrl.isBlank())
        ? "<img src=\"" + esc(logoUrl) + "\" alt=\"" + esc(orgName) + "\" height=\"34\" style=\"display:block;border:0;\"/>"
        : "<div style=\"font-weight:900;letter-spacing:.02em;\">" + esc(orgName) + "</div>",
      esc(orgLocation),
      esc(title),
      intro,
      mainHtml,
      (extrasHtml == null || extrasHtml.isBlank()) ? "" : "<div style=\"margin-top:14px;\">" + extrasHtml + "</div>",
      footerHtml,
      esc(noSlash(siteUrl))
    );
  }
  
  //------------- DONATION RECIPT ------------//
  
//------------- DONATION RECIPT ------------//
  
  public EmailContent donationReceipt(
		  String donorEmail,
		  Long amountCents,
		  String currency,
		  String projectTitleOrNull
		) {
		  String subject = orgName + " — Donation confirmation";

		  String amount = String.format("$%.2f %s", amountCents / 100.0, (currency == null ? "CAD" : currency.toUpperCase()));
		  String projLine = (projectTitleOrNull == null || projectTitleOrNull.isBlank())
		    ? "Donation target: Where needed most"
		    : "Donation target: " + projectTitleOrNull;

		  String text =
		    "Hello,\n\n" +
		    "Thank you for supporting " + orgName + ". Your donation has been confirmed.\n\n" +
		    "Amount: " + amount + "\n" +
		    projLine + "\n\n" +
		    "This email is a payment confirmation and is not an official charitable tax receipt.\n\n" +
		    "If you have any questions, reply to this email or contact: " + supportEmail + "\n\n" +
		    orgName + " • " + orgLocation + "\n";

		  String html = layout(
		    "Donation confirmed",
		    "Thank you for supporting <b>" + esc(orgName) + "</b>. Your donation has been confirmed.",
		    pillRow("Amount", esc(amount)) +
		      pillRow("Donation target", esc((projectTitleOrNull == null || projectTitleOrNull.isBlank())
		        ? "Where needed most"
		        : projectTitleOrNull)) +
		      para("This email is a payment confirmation and is <b>not</b> an official charitable tax receipt."),
		    "",
			transactionalFooter()
		  );

		  // Transactional email: no list-unsubscribe header needed
		  return new EmailContent(subject, text, html, null);
		}
  

  private String button(String text, String url) {
    return """
	<div style="margin-top:14px;">
	  <a href="%s" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">
	    %s
	  </a>
	</div>
	""".formatted(esc(url), esc(text));
	  }
	
	  private String para(String s) {
	    return "<div style=\"margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);\">" + s + "</div>";
	  }
	
	  private String pillRow(String k, String v) {
	    return """
	<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">
	  <span style="font-weight:800;">%s:</span> %s
	</div>
	""".formatted(k, v);
  }

  private String image(String url) {
    return """
	<div style="margin-top:14px;">
	  <img src="%s" alt="" style="width:100%%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />
	</div>
	""".formatted(esc(url));
  }

  private String infoList(String[] items) {
    StringBuilder sb = new StringBuilder();
    sb.append("<ul style=\"margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;\">");
    for (String it : items) sb.append("<li>").append(esc(it)).append("</li>");
    sb.append("</ul>");
    return sb.toString();
  }

  private String footer(String unsubscribeUrl) {
    String unsub = (unsubscribeUrl == null || unsubscribeUrl.isBlank())
      ? ""
      : "<a href=\"" + esc(unsubscribeUrl) + "\" style=\"color:#11878D;text-decoration:underline;font-weight:700;\">Unsubscribe</a>";

    return """
	<div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">
	  <div style="font-weight:900;margin-bottom:6px;">%s</div>
	  <div>Support: <a href="mailto:%s" style="color:#11878D;text-decoration:underline;">%s</a></div>
	  <div style="font-size: 10px; margin-top:8px;">%s</div>
	</div>
	""".formatted(esc(orgName), esc(supportEmail), esc(supportEmail), unsub);
  }
  
  private String transactionalFooter() {
	  return """
	  <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-align:center;">
	    <div style="font-weight:900;margin-bottom:6px;">%s</div>
	    <div>%s</div>
	    <div>Support: <a href="mailto:%s" style="color:#11878D;text-decoration:underline;">%s</a></div>
	  </div>
	  """.formatted(esc(orgName), esc(orgLocation), esc(supportEmail), esc(supportEmail));
  }

  private String esc(String s) {
    if (s == null) return "";
    return s.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;");
  }
}
