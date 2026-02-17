package com.pxp.backend.web.dto;

public class CreateDonationCheckoutResponse {
	  
	public Long donationId;
	  public String sessionId;
	  public String clientSecret;

	  public CreateDonationCheckoutResponse(Long donationId, String sessionId, String clientSecret) {
	    this.donationId = donationId;
	    this.sessionId = sessionId;
	    this.clientSecret = clientSecret;
	  }
	}