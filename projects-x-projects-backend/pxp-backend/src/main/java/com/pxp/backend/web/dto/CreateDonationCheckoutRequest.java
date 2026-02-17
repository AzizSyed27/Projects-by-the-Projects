package com.pxp.backend.web.dto;

public class CreateDonationCheckoutRequest {
	  public Long amountCents;   // REQUIRED
	  public String currency;    // optional (default alread set to cad)
	  public Long projectId;     // optional
	}