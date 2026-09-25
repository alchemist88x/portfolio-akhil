import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import SiteSettings from "../models/SiteSettings";
import AboutSection from "../models/AboutSection";
import Experience from "../models/Experience";
import SkillCategory from "../models/SkillCategory";
import Skill from "../models/Skill";
import Project from "../models/Project";
import Architecture from "../models/Architecture";
import ArchitectureNode from "../models/ArchitectureNode";
import ArchitectureConnection from "../models/ArchitectureConnection";
import Pipeline from "../models/Pipeline";
import PipelineStage from "../models/PipelineStage";
import EngineeringPrinciple from "../models/EngineeringPrinciple";
import Hobby from "../models/Hobby";
import SocialLink from "../models/SocialLink";
import NavigationItem from "../models/NavigationItem";
import TerminalCommand from "../models/TerminalCommand";
import SEOSettings from "../models/SEOSettings";

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
  defaultSEOSettings,
} from "../lib/initial-data";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is required.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    // 1. Site Settings
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create(defaultSiteSettings);
      console.log("✓ Site settings seeded");
    }

    // 2. About Section
    const aboutCount = await AboutSection.countDocuments();
    if (aboutCount === 0) {
      await AboutSection.create(defaultAboutSection);
      console.log("✓ About section seeded");
    }

    // 3. Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(defaultExperiences);
      console.log("✓ Experience records seeded");
    }

    // 4. Skill Categories & Skills
    const catCount = await SkillCategory.countDocuments();
    if (catCount === 0) {
      for (const catData of defaultSkillCategories) {
        const { skills, ...catFields } = catData;
        const createdCat = await SkillCategory.create(catFields);

        const skillDocs = skills.map((skillName, index) => ({
          categoryId: createdCat._id,
          name: skillName,
          slug: skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sortOrder: index + 1,
          published: true,
          level: "",
          featured: index < 2,
        }));
        await Skill.insertMany(skillDocs);
      }
      console.log("✓ Skill categories and skills seeded");
    }

    // 5. Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log("✓ Projects seeded");
    }

    // 6. Architecture & Nodes & Connections
    const archCount = await Architecture.countDocuments();
    if (archCount === 0) {
      const arch = await Architecture.create({
        name: defaultArchitecture.name,
        title: defaultArchitecture.title,
        description: defaultArchitecture.description,
        published: defaultArchitecture.published,
      });

      const createdNodes = [];
      for (const nodeData of defaultArchitecture.nodes) {
        const node = await ArchitectureNode.create({
          architectureId: arch._id,
          ...nodeData,
        });
        createdNodes.push(node);
      }

      for (const conn of defaultArchitecture.connections) {
        await ArchitectureConnection.create({
          architectureId: arch._id,
          sourceNodeId: createdNodes[conn.sourceIndex]._id,
          targetNodeId: createdNodes[conn.targetIndex]._id,
          label: conn.label,
        });
      }
      console.log("✓ Architecture diagram seeded");
    }

    // 7. CI/CD Pipeline
    const pipeCount = await Pipeline.countDocuments();
    if (pipeCount === 0) {
      const pipeline = await Pipeline.create({
        name: defaultPipeline.name,
        description: defaultPipeline.description,
        published: defaultPipeline.published,
      });

      for (const stage of defaultPipeline.stages) {
        await PipelineStage.create({
          pipelineId: pipeline._id,
          ...stage,
        });
      }
      console.log("✓ CI/CD Pipeline seeded");
    }

    // 8. Principles
    const princCount = await EngineeringPrinciple.countDocuments();
    if (princCount === 0) {
      await EngineeringPrinciple.insertMany(defaultEngineeringPrinciples);
      console.log("✓ Engineering principles seeded");
    }

    // 9. Hobbies
    const hobbyCount = await Hobby.countDocuments();
    if (hobbyCount === 0) {
      await Hobby.insertMany(defaultHobbies);
      console.log("✓ Hobbies seeded");
    }

    // 10. Social Links
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      await SocialLink.insertMany(defaultSocialLinks);
      console.log("✓ Social links seeded");
    }

    // 11. Navigation Items
    const navCount = await NavigationItem.countDocuments();
    if (navCount === 0) {
      await NavigationItem.insertMany(defaultNavigationItems);
      console.log("✓ Navigation items seeded");
    }

    // 12. Terminal Commands
    const termCount = await TerminalCommand.countDocuments();
    if (termCount === 0) {
      await TerminalCommand.insertMany(defaultTerminalCommands);
      console.log("✓ Terminal commands seeded");
    }

    // 13. SEO Settings
    const seoCount = await SEOSettings.countDocuments();
    if (seoCount === 0) {
      await SEOSettings.create(defaultSEOSettings);
      console.log("✓ SEO settings seeded");
    }

    console.log("🎉 Database seeding complete!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
