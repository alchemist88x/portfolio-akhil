import React from "react";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import AboutSectionModel from "@/models/AboutSection";
import Experience from "@/models/Experience";
import SkillCategory from "@/models/SkillCategory";
import Skill from "@/models/Skill";
import Project from "@/models/Project";
import Architecture from "@/models/Architecture";
import ArchitectureNode from "@/models/ArchitectureNode";
import ArchitectureConnection from "@/models/ArchitectureConnection";
import Pipeline from "@/models/Pipeline";
import PipelineStage from "@/models/PipelineStage";
import EngineeringPrinciple from "@/models/EngineeringPrinciple";
import Hobby from "@/models/Hobby";
import SocialLink from "@/models/SocialLink";
import NavigationItem from "@/models/NavigationItem";
import TerminalCommand from "@/models/TerminalCommand";
import SEOSettings from "@/models/SEOSettings";

import {
  defaultSiteSettings,
  defaultAboutSection,
  defaultExperiences,
  defaultSkillCategories,
  defaultProjects,
  defaultArchitecture,
  defaultPipeline,
  defaultEngineeringPrinciples,
  defaultHobbies,
  defaultSocialLinks,
  defaultNavigationItems,
  defaultTerminalCommands,
} from "@/lib/initial-data";

// Public Portfolio Components
import SystemBoot from "@/components/hero/SystemBoot";
import Navigation from "@/components/navigation/Navigation";
import Hero from "@/components/hero/Hero";
import SystemStatus from "@/components/status/SystemStatus";
import EngineeringTimeline from "@/components/timeline/EngineeringTimeline";
import WhatIBuild from "@/components/hero/WhatIBuild";
import ArchitectureDiagram from "@/components/architecture/ArchitectureDiagram";
import CicdPipeline from "@/components/pipeline/CicdPipeline";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TechStack from "@/components/skills/TechStack";
import ExperienceSection from "@/components/experience/ExperienceSection";
import AboutSection from "@/components/about/AboutSection";
import EngineeringPrinciples from "@/components/principles/EngineeringPrinciples";
import HobbiesSection from "@/components/hobbies/HobbiesSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/footer/Footer";

export const revalidate = 60; // Next.js dynamic cache revalidation

export default async function HomePage() {
  const db = await connectToDatabase();

  let settings = defaultSiteSettings;
  let about = defaultAboutSection;
  let experiences = defaultExperiences;
  let skillCategories: any[] = [];
  let projects: any[] = defaultProjects;
  let architecture: any = defaultArchitecture;
  let architectureNodes: any[] = defaultArchitecture.nodes.map((n, idx) => ({ ...n, _id: String(idx) }));
  let architectureConnections: any[] = defaultArchitecture.connections.map((c) => ({
    _id: `${c.sourceIndex}-${c.targetIndex}`,
    sourceNodeId: String(c.sourceIndex),
    targetNodeId: String(c.targetIndex),
    label: c.label,
  }));
  let pipeline: any = defaultPipeline;
  let pipelineStages: any[] = defaultPipeline.stages.map((s, idx) => ({ ...s, _id: String(idx) }));
  let principles = defaultEngineeringPrinciples;
  let hobbies = defaultHobbies;
  let socialLinks: any[] = defaultSocialLinks;
  let navItems = defaultNavigationItems;
  let terminalCommands: any[] = defaultTerminalCommands;

  if (db.isConnected) {
    try {
      const [
        dbSettings,
        dbAbout,
        dbExperiences,
        dbCategories,
        dbSkills,
        dbProjects,
        dbArchitecture,
        dbPipeline,
        dbPrinciples,
        dbHobbies,
        dbSocial,
        dbNav,
        dbCommands,
      ] = await Promise.all([
        SiteSettings.findOne().lean(),
        AboutSectionModel.findOne().lean(),
        Experience.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        SkillCategory.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        Skill.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        Project.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        Architecture.findOne({ published: true }).lean(),
        Pipeline.findOne({ published: true }).lean(),
        EngineeringPrinciple.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        Hobby.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        SocialLink.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        NavigationItem.find({ published: true }).sort({ sortOrder: 1 }).lean(),
        TerminalCommand.find({ published: true }).sort({ sortOrder: 1 }).lean(),
      ]);

      if (dbSettings) settings = JSON.parse(JSON.stringify(dbSettings));
      if (dbAbout) about = JSON.parse(JSON.stringify(dbAbout));
      if (dbExperiences && dbExperiences.length > 0)
        experiences = JSON.parse(JSON.stringify(dbExperiences));

      if (dbCategories && dbCategories.length > 0) {
        const parsedCategories = JSON.parse(JSON.stringify(dbCategories));
        const parsedSkills = JSON.parse(JSON.stringify(dbSkills || []));
        skillCategories = parsedCategories.map((cat: any) => ({
          ...cat,
          skills: parsedSkills.filter((s: any) => s.categoryId?.toString() === cat._id?.toString()),
        }));
      }

      if (dbProjects && dbProjects.length > 0)
        projects = JSON.parse(JSON.stringify(dbProjects));

      if (dbArchitecture) {
        architecture = JSON.parse(JSON.stringify(dbArchitecture));
        const [dbNodes, dbConns] = await Promise.all([
          ArchitectureNode.find({ architectureId: dbArchitecture._id, published: true })
            .sort({ sortOrder: 1 })
            .lean(),
          ArchitectureConnection.find({ architectureId: dbArchitecture._id }).lean(),
        ]);
        if (dbNodes && dbNodes.length > 0) architectureNodes = JSON.parse(JSON.stringify(dbNodes));
        if (dbConns && dbConns.length > 0)
          architectureConnections = JSON.parse(JSON.stringify(dbConns));
      }

      if (dbPipeline) {
        pipeline = JSON.parse(JSON.stringify(dbPipeline));
        const dbStages = await PipelineStage.find({
          pipelineId: dbPipeline._id,
          published: true,
        })
          .sort({ sortOrder: 1 })
          .lean();
        if (dbStages && dbStages.length > 0) pipelineStages = JSON.parse(JSON.stringify(dbStages));
      }

      if (dbPrinciples && dbPrinciples.length > 0)
        principles = JSON.parse(JSON.stringify(dbPrinciples));
      if (dbHobbies && dbHobbies.length > 0) hobbies = JSON.parse(JSON.stringify(dbHobbies));
      if (dbSocial && dbSocial.length > 0) socialLinks = JSON.parse(JSON.stringify(dbSocial));
      if (dbNav && dbNav.length > 0) navItems = JSON.parse(JSON.stringify(dbNav));
      if (dbCommands && dbCommands.length > 0)
        terminalCommands = JSON.parse(JSON.stringify(dbCommands));
    } catch (fetchErr) {
      console.error("[Home Page Server Fetch Error]", fetchErr);
    }
  }

  // Fallback skills categorization if empty
  if (skillCategories.length === 0) {
    skillCategories = defaultSkillCategories.map((c, idx) => ({
      _id: String(idx),
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      sortOrder: c.sortOrder,
      published: c.published,
      skills: c.skills.map((s, sIdx) => ({
        _id: `${idx}-${sIdx}`,
        categoryId: String(idx),
        name: s,
        slug: s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        level: "",
        featured: sIdx < 2,
        published: true,
      })),
    }));
  }

  // Pre-aggregated skills list for Terminal
  const allVerifiedSkills = skillCategories.flatMap((c) =>
    (c.skills || []).map((s: any) => s.name)
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* 01 — SYSTEM BOOT SEQUENCE */}
      <SystemBoot />

      {/* STICKY NAVIGATION */}
      <Navigation items={navItems} engineerName={settings.name || "AKHIL"} />

      <main className="flex-1">
        {/* 02 — HERO */}
        <Hero
          settings={settings}
          terminalCommands={terminalCommands}
          skills={allVerifiedSkills}
          projects={projects.map((p) => ({ name: p.name, category: p.category }))}
          experience={experiences.map((e) => ({
            company: e.company,
            role: e.role,
            dates: `${e.startDate} — ${e.current ? "Present" : e.endDate}`,
          }))}
        />

        {/* 03 — SYSTEM STATUS */}
        <SystemStatus status={settings} />

        {/* 04 — ENGINEERING TIMELINE */}
        <EngineeringTimeline experiences={experiences} />

        {/* 05 — WHAT I BUILD */}
        <WhatIBuild />

        {/* 06 — INFRASTRUCTURE ARCHITECTURE */}
        <ArchitectureDiagram
          architecture={architecture}
          nodes={architectureNodes}
          connections={architectureConnections}
        />

        {/* 07 — CI/CD PIPELINE */}
        <CicdPipeline pipeline={pipeline} stages={pipelineStages} />

        {/* 08 — FEATURED PROJECTS */}
        <FeaturedProjects projects={projects} />

        {/* 09 — TECHNOLOGY STACK */}
        <TechStack categories={skillCategories} />

        {/* 10 — EXPERIENCE */}
        <ExperienceSection experiences={experiences} />

        {/* 12 — ABOUT */}
        <AboutSection about={about} />

        {/* 13 — ENGINEERING PRINCIPLES */}
        <EngineeringPrinciples principles={principles} />

        {/* 14 — HOBBIES */}
        <HobbiesSection hobbies={hobbies} />

        {/* 15 — CONTACT */}
        <ContactSection
          contactEmail={settings.contactEmail}
          location={settings.location}
          socialLinks={socialLinks}
        />
      </main>

      {/* 16 — FOOTER */}
      <Footer settings={settings} socialLinks={socialLinks} />
    </div>
  );
}
