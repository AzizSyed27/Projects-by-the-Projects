package com.pxp.backend.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pxp.backend.repo.DonationRepository;
import com.pxp.backend.repo.ProjectRepository;
import com.pxp.backend.web.ProjectFundingController.FundingRow;

@RestController
@RequestMapping("/api/projects")
public class ProjectFundingController {

  private final DonationRepository donationRepo;
  private final ProjectRepository projectRepo;

  public ProjectFundingController(DonationRepository donationRepo, ProjectRepository projectRepo) {
    this.donationRepo = donationRepo;
    this.projectRepo = projectRepo;
  }

  public record FundingRow(Long projectId, Long raisedCents, Long goalCents) {}

  @GetMapping("/funding")
  public List<FundingRow> funding() {
    // raised map from donations
    Map<Long, Long> raised = new HashMap<>();
    for (Object[] r : donationRepo.sumPaidByProject()) {
      Long pid = (Long) r[0];
      Long sum = (Long) r[1];
      raised.put(pid, sum);
    }

    // join with project goals
    return projectRepo.findAll().stream()
      .map(p -> new FundingRow(
        p.getId(),
        raised.getOrDefault(p.getId(), 0L),
        p.getFundingGoalCents()
      ))
      .toList();
  }
}
