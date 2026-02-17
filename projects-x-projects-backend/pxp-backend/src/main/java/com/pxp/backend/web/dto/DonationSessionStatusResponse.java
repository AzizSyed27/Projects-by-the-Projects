package com.pxp.backend.web.dto;

public class DonationSessionStatusResponse {
	
	  public String status;     // DB status
	  public Long amountCents;
	  public String currency;
	
	  public DonationSessionStatusResponse(String status, Long amountCents, String currency) {
	    this.status = status;
	    this.amountCents = amountCents;
	    this.currency = currency;
	  }
}
