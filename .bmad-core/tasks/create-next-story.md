# Create Next Story Task

## Purpose

To identify the next logical story based on project progress and epic definitions, and then to prepare a comprehensive, self-contained, and actionable story file using the `Story Template`. This task ensures the story is enriched with all necessary technical context, requirements, and acceptance criteria, making it ready for efficient implementation by a Developer Agent with minimal need for additional research.

## Task Execution Instructions

### 0. Load Core Configuration

[[LLM: CRITICAL - This MUST be your first step]]

- Load `.bmad-core/core-config.yml` from the project root
- If the file does not exist:
  - HALT and inform the user: "core-config.yml not found. This file is required for story creation. You can:
    1. Copy it from GITHUB BMAD-METHOD/bmad-core/core-config.yml and configure it for your project
    2. Run the BMAD installer against your project to upgrade and add the file automatically
    Please add and configure core-config.yml before proceeding."
- Extract the following key configurations:
  - `dev-story-location`: Where to save story files
  - `prd.prdSharded`: Whether PRD is sharded or monolithic
  - `prd.prd-file`: Location of monolithic PRD (if not sharded)
  - `prd.prdShardedLocation`: Location of sharded epic files
  - `prd.epicFilePattern`: Pattern for epic files (e.g., `epic-{n}*.md`)
  - `architecture.architectureVersion`: Architecture document version
  - `architecture.architectureSharded`: Whether architecture is sharded
  - `architecture.architecture-file`: Location of monolithic architecture
  - `architecture.architectureShardedLocation`: Location of sharded architecture files

### 1. Identify Next Story for Preparation

#### 1.1 Locate Epic Files

- Based on `prdSharded` from config:
  - **If `prdSharded: true`**: Look for epic files in `prdShardedLocation` using `epicFilePattern`
  - **If `prdSharded: false`**: Load the full PRD from `prd-file` and extract epics from section headings (## Epic N or ### Epic N)

#### 1.2 Review Existing Stories

- Check `dev-story-location` from config (e.g., `docs/stories/`) for existing story files
- If the directory exists and has at least 1 file, find the highest-numbered story file.
- **If a highest story file exists (`{lastEpicNum}.{lastStoryNum}.story.md`):**
  - Verify its `Status` is 'Done' (or equivalent).
  - If not 'Done', present an alert to the user:

    ```plaintext
    ALERT: Found incomplete story:
    File: {lastEpicNum}.{lastStoryNum}.story.md
    Status: [current status]

    Would you like to:
    1. View the incomplete story details (instructs user to do so, agent does not display)
    2. Cancel new story creation at this time
    3. Accept risk & Override to create the next story in draft

    Please choose an option (1/2/3):
    ```

  - Proceed only if user selects option 3 (Override) or if the last story was 'Done'.
  - If proceeding: Look for the Epic File for `{lastEpicNum}` (e.g., `epic-{lastEpicNum}*.md`) and check for a story numbered `{lastStoryNum + 1}`. If it exists and its prerequisites (per Epic File) are met, this is the next story.
  - Else (story not found or prerequisites not met): The next story is the first story in the next Epic File (e.g., look for `epic-{lastEpicNum + 1}*.md`, then `epic-{lastEpicNum + 2}*.md`, etc.) whose prerequisites are met.

- **If no story files exist in `docs/stories/`:**
  - The next story is the first story in the first epic file (look for `epic-1-*.md`, then `epic-2-*.md`, etc.) whose prerequisites are met.
- If no suitable story with met prerequisites is found, report to the user that story creation is blocked, specifying what prerequisites are pending. HALT task.
- Announce the identified story to the user: "Identified next story for preparation: {epicNum}.{storyNum} - {Story Title}".

### 2. Gather Core Story Requirements (from Epic)

- For the identified story, review its parent Epic (e.g., `epic-{epicNum}*.md` from the location identified in step 1.1).
- Extract: Exact Title, full Goal/User Story statement, initial list of Requirements, all Acceptance Criteria (ACs), and any predefined high-level Tasks.
- Keep a record of this original epic-defined scope for later deviation analysis.

### 3. Review Previous Story and Extract Dev Notes

[[LLM: This step is CRITICAL for continuity and learning from implementation experience]]

- If this is not the first story (i.e., previous story exists):
  - Read the previous sequential story from `docs/stories`
  - Pay special attention to:
    - Dev Agent Record sections (especially Completion Notes and Debug Log References)
    - Any deviations from planned implementation
    - Technical decisions made during implementation
    - Challenges encountered and solutions applied
    - Any "lessons learned" or notes for future stories
  - Extract relevant insights that might inform the current story's preparation

### 4. Gather & Synthesize Architecture Context

[[LLM: CRITICAL - You MUST gather technical details from the architecture documents. NEVER make up technical details not found in these documents.]]

#### 4.1 Determine Architecture Document Strategy

Based on configuration loaded in Step 0:

- **If `architectureVersion: v4` and `architectureSharded: true`**:
  - Read `{architectureShardedLocation}/index.md` to understand available documentation
  - Follow the structured reading order in section 4.2 below
  
- **If `architectureVersion: v4` and `architectureSharded: false`**:
  - Load the monolithic architecture from `architecture-file`
  - Extract relevant sections based on v4 structure (tech stack, project structure, etc.)
  
- **If `architectureVersion` is NOT v4**:
  - Inform user: "Architecture document is not v4 format. Will use best judgment to find relevant information."
  - If `architectureSharded: true`: Search sharded files by filename relevance
  - If `architectureSharded: false`: Search within monolithic `architecture-file` for relevant sections

#### 4.2 Recommended Reading Order Based on Story Type (v4 Sharded Only)

[[LLM: Use this structured approach ONLY for v4 sharded architecture. For other versions, use best judgment based on file names and content.]]

**For ALL Stories:**

1. `docs/architecture/tech-stack.md` - Understand technology constraints and versions
2. `docs/architecture/unified-project-structure.md` - Know where code should be placed
3. `docs/architecture/coding-standards.md` - Ensure dev follows project conventions
4. `docs/architecture/testing-strategy.md` - Include testing requirements in tasks

**For Backend/API Stories, additionally read:**
5. `docs/architecture/data-models.md` - Data structures and validation rules
6. `docs/architecture/database-schema.md` - Database design and relationships
7. `docs/architecture/backend-architecture.md` - Service patterns and structure
8. `docs/architecture/rest-api-spec.md` - API endpoint specifications
9. `docs/architecture/external-apis.md` - Third-party integrations (if relevant)

**For Frontend/UI Stories, additionally read:**
5. `docs/architecture/frontend-architecture.md` - Component structure and patterns
6. `docs/architecture/components.md` - Specific component designs
7. `docs/architecture/core-workflows.md` - User interaction flows
8. `docs/architecture/data-models.md` - Frontend data handling

**For Full-Stack Stories:**

- Read both Backend and Frontend sections above

#### 4.3 Extract Story-Specific Technical Details

[[LLM: As you read each document, extract ONLY the information directly relevant to implementing the current story. Do NOT include general information unless it directly impacts the story implementation.]]

For each relevant document, extract:

- Specific data models, schemas, or structures the story will use
- API endpoints the story must implement or consume
- Component specifications for UI elements in the story
- File paths and naming conventions for new code
- Testing requirements specific to the story's features
- Security or performance considerations affecting the story

#### 4.4 Document Source References

[[LLM: ALWAYS cite the source document and section for each technical detail you include. This helps the dev agent verify information if needed.]]

Format references as: `[Source: architecture/{filename}.md#{section}]`

### 5. Verify Project Structure Alignment

- Cross-reference the story's requirements and anticipated file manipulations with the Project Structure Guide from `docs/architecture/unified-project-structure.md`.
- Ensure any file paths, component locations, or module names implied by the story align with defined structures.
- Document any structural conflicts, necessary clarifications, or undefined components/paths in a "Project Structure Notes" section within the story draft.

### 6. Populate Story Template with Full Context

- Create a new story file: `{dev-story-location}/{epicNum}.{storyNum}.story.md` (using location from config).
- Use the Story Template to structure the file.
- Fill in:
  - Story `{EpicNum}.{StoryNum}: {Short Title Copied from Epic File}`
  - `Status: Draft`
  - `Story` (User Story statement from Epic)
  - `Acceptance Criteria (ACs)` (from Epic, to be refined if needed based on context)
- **`Dev Technical Guidance` section (CRITICAL):**

  [[LLM: This section MUST contain ONLY information extracted from the architecture shards. NEVER invent or assume technical details.]]

  - Include ALL relevant technical details gathered from Steps 3 and 4, organized by category:
    - **Previous Story Insights**: Key learnings or considerations from the previous story
    - **Data Models**: Specific schemas, validation rules, relationships [with source references]
    - **API Specifications**: Endpoint details, request/response formats, auth requirements [with source references]
    - **Component Specifications**: UI component details, props, state management [with source references]
    - **File Locations**: Exact paths where new code should be created based on project structure
    - **Testing Requirements**: Specific test cases or strategies from testing-strategy.md
    - **Technical Constraints**: Version requirements, performance considerations, security rules
  - Every technical detail MUST include its source reference: `[Source: architecture/{filename}.md#{section}]`
  - If information for a category is not found in the architecture docs, explicitly state: "No specific guidance found in architecture docs"

- **`Tasks / Subtasks` section:**
  - Generate a detailed, sequential list of technical tasks based ONLY on:
    - Requirements from the Epic
    - Technical constraints from architecture shards
    - Project structure from unified-project-structure.md
    - Testing requirements from testing-strategy.md
  - Each task must reference relevant architecture documentation
  - Include unit testing as explicit subtasks based on testing-strategy.md
  - Link tasks to ACs where applicable (e.g., `Task 1 (AC: 1, 3)`)
- Add notes on project structure alignment or discrepancies found in Step 5.
- Prepare content for the "Deviation Analysis" based on any conflicts between epic requirements and architecture constraints.

### 7. Run Story Draft Checklist

- Execute the Story Draft Checklist against the prepared story
- Document any issues or gaps identified
- Make necessary adjustments to meet quality standards
- Ensure all technical guidance is properly sourced from architecture docs

### 8. Finalize Story File

- Review all sections for completeness and accuracy
- Verify all source references are included for technical details
- Ensure tasks align with both epic requirements and architecture constraints
- Update status to "Draft"
- Save the story file to `{dev-story-location}/{epicNum}.{storyNum}.story.md` (using location from config)

### 9. Report Completion

Provide a summary to the user including:

- Story created: `{epicNum}.{storyNum} - {Story Title}`
- Status: Draft
- Key technical components included from architecture docs
- Any deviations or conflicts noted between epic and architecture
- Recommendations for story review before approval
- Next steps: Story should be reviewed by PO for approval before dev work begins

[[LLM: Remember - The success of this task depends on extracting real, specific technical details from the architecture shards. The dev agent should have everything they need in the story file without having to search through multiple documents.]]
