<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" version="1.0">
    <xsl:output method="xml" indent="yes" />
    <xsl:param name="bIncludeCSSStyles" select="true()" />
    <xsl:param name="bIncludeElementIds" select="true()" />
    <xsl:param name="sImageLocation" />
    <xsl:param name="bShowOnly" select="false()" />
    <xsl:param name="bAutoComplete" select="false()" />

    <xsl:template match="Questions">
        <!-- iterate through the questions eleents in the XML structure -->
            <xsl:for-each select="*">
                <xsl:choose>
                    <xsl:when test="name()='Question'">
                        <xsl:call-template name="Question" />
                    </xsl:when>
                    <xsl:otherwise>
                    <Other>
                        <xsl:value-of select="name()" />
                    </Other>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
    </xsl:template>    

    <xsl:template name="Question">
        <!-- iterate through the question eleents in the XML structure -->
        <!-- question elements are contained within the questions element -->
        <xsl:variable name="BgColor">
            <xsl:value-of select="Style/@BgColor"/>
        </xsl:variable>

        <xsl:variable name="qType">
            <xsl:call-template name="funcGetQType">
                <xsl:with-param name="BgColor" select="$BgColor"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="qGroup">
            <xsl:call-template name="funcGetQGroup">
                <xsl:with-param name="BgColor" select="$BgColor"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:element name="question">        
            <xsl:call-template name="LaunchQType">
                <xsl:with-param name="qType" select="$qType"/>
                <xsl:with-param name="qGroup" select="$qGroup"/>
            </xsl:call-template>
        </xsl:element>

    </xsl:template>

    <!-- Sub-routines -->
    <!-- ============ -->
    <xsl:template name="LaunchQType">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />

        <xsl:choose>
            <xsl:when test="$qType='input-singleline-number'">
                <xsl:call-template name="input-singleline-number">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                </xsl:call-template>
            </xsl:when>
        </xsl:choose>

    </xsl:template>

    <xsl:template name="insert-input">
        <xsl:param name="InputType" select="text" />
        <xsl:param name="qGroup" />
        <xsl:param name="isHidden" select="false()" />

        <xsl:element name="input">
            <!-- insert base attributes -->
            <xsl:call-template name="insert-common-input-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:attribute name="id">
                <xsl:value-of select="@ElementID" />
            </xsl:attribute>

            <!--- Set Input specific attributes -->
            <xsl:attribute name="type">
                <xsl:value-of select="$InputType"/>
            </xsl:attribute>

            <xsl:if test="@MinValue">
                <xsl:attribute name="min">
                    <xsl:value-of select="@MinValue" />
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="@MaxValue">
                <xsl:attribute name="max">
                    <xsl:value-of select="@MaxValue" />
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="@Length">
                <xsl:attribute name="maxlength">
                    <xsl:value-of select="@Length" />
                </xsl:attribute>
            </xsl:if>


            <!--- Accelerator access key -->
            <xsl:if test="Style/Control/@Accelerator != ''">
                <xsl:attribute name="accesskey">
                    <xsl:value-of select="Style/Control/@Accelerator" />
                </xsl:attribute>
            </xsl:if>
        </xsl:element>
    </xsl:template>

   <xsl:template name="insert-input-option">
        <xsl:param name="InputType" select="text" />
        <xsl:param name="qGroup" />
        <xsl:param name="isHidden" select="false()" />
        <xsl:param name="controlId" />

        <xsl:element name="input">
            <!-- insert base attributes -->
            <xsl:call-template name="insert-common-input-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:attribute name="id">
                <xsl:value-of select="$controlId" />
            </xsl:attribute>

            <!--- Set Input specific attributes -->
            <xsl:attribute name="type">
                <xsl:value-of select="$InputType"/>
            </xsl:attribute>

            <!--- Accelerator access key -->
            <xsl:if test="Style/Control/@Accelerator != ''">
                <xsl:attribute name="accesskey">
                    <xsl:value-of select="Style/Control/@Accelerator" />
                </xsl:attribute>
            </xsl:if>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label">
        <xsl:param name="subType" />
        <xsl:element name="label">
            <xsl:attribute name="for">
                <xsl:value-of select="@ElementID" />
            </xsl:attribute>
            <xsl:element name="span">
                <xsl:attribute name="class">
                    <xsl:text>a-label</xsl:text>
                    <xsl:if test="$subType != ''">
                        <xsl:text>-</xsl:text>
                        <xsl:value-of select="$subType" />
                    </xsl:if>
                </xsl:attribute>
                <xsl:call-template name="insert-common-labelstyle-attributes" />
            
                <xsl:call-template name="insert-label-text" />      
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-option">
        <xsl:param name="subType" />
        <xsl:param name="controlId" />
        <xsl:element name="label">
            <xsl:attribute name="for">
                <xsl:value-of select="$controlId" />
            </xsl:attribute>
            
            <xsl:call-template name="insert-label-icon-multistate">
                <xsl:with-param name="iconType" select="$subType" />
            </xsl:call-template>

            <xsl:element name="span">
                <xsl:attribute name="class">
                    <xsl:text>a-label</xsl:text>
                    <xsl:if test="$subType != ''">
                        <xsl:text>-</xsl:text>
                        <xsl:value-of select="$subType" />
                    </xsl:if>
                </xsl:attribute>
                <xsl:call-template name="insert-common-labelstyle-attributes" />
            
                <xsl:call-template name="insert-label-text">
                    <xsl:with-param name="content" select="Category/Label/Text" />
                </xsl:call-template>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-icon-multistate">
        <xsl:param name="iconType" />

        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>a-icon-multistate</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="data-icon-type">
                <xsl:choose>
                    <xsl:when test="$iconType='radio'">
                        <xsl:text>radio</xsl:text>
                    </xsl:when>
                    <xsl:when test="$iconType='checkbox'">
                        <xsl:text>checkbox</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$iconType" />
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
        </xsl:element> 
    </xsl:template>

    <xsl:template name="insert-label-text">
        <xsl:param name="content" />
        <xsl:choose>
            <xsl:when test="Text/@WellFormed = 'false'">
                <xsl:value-of select="$content" />
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of disable-output-escaping="yes" select="$content" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="insert-common-input-attributes">
        <xsl:param name="qGroup" />
        <!-- adds all the attributes that are used in every input connected to the form -->
        <xsl:attribute name="data-question-group">
            <xsl:value-of select="$qGroup" />
        </xsl:attribute>

        <!--- Set name, id, min, max, maxlength -->
        <xsl:attribute name="name">
            <xsl:value-of select="@QuestionName" />
        </xsl:attribute>

        <!--- Show current response -->
        <xsl:if test="@Value">
            <xsl:attribute name="value">
                <xsl:value-of select="@Value" />
            </xsl:attribute>
        </xsl:if>

        <!--- Adds class to define below/side position -->
        <xsl:call-template name="set-data-position">
            <xsl:with-param name="position" select="Style/@ElementAlign" />
        </xsl:call-template>

    </xsl:template>

    <xsl:template name="insert-common-labelstyle-attributes">
    </xsl:template>

    <!-- Question Types -->
    <!-- ============== -->

    <xsl:template name="input-singleline-number">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:element name="o-input-singlelineedit-number">

        <xsl:attribute name="data-question-group">
            <xsl:value-of select="$qGroup" />
        </xsl:attribute>

        <xsl:attribute name="data-question-id">
            <xsl:value-of select="Control[1]/@ElementID" />
        </xsl:attribute>

        <xsl:attribute name="class">
            <xsl:choose>
                <xsl:when test="Style/@ElementAlign='NewLine'">
                    <xsl:text>below</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>side</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>

            <xsl:for-each select="Control[@Type='SingleLineEdit']">
                <xsl:call-template name='m-input-singlelineedit'>
                    <xsl:with-param name="InputType">
                        <xsl:text>number</xsl:text>
                    </xsl:with-param>
                    <xsl:with-param name="qGroup">
                        <xsl:value-of select="$qGroup" />
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:for-each>

            <xsl:element name="o-list-choice">
                <xsl:for-each select="Control[not(@Type='SingleLineEdit')]">

                    <xsl:variable name="isExclusive">
                        <xsl:choose>
                            <xsl:when test="@Type='CheckButton'">
                                <xsl:choose>
                                    <xsl:when test="Category/Label/Style/Font/@IsBold">
                                        <xsl:text>true</xsl:text>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:text>false</xsl:text>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:when>
                            <xsl:when test="@Type='RadioButton'">
                                <xsl:text>true</xsl:text>
                            </xsl:when>
                        </xsl:choose>
                    </xsl:variable>

                    <xsl:call-template name='m-option-base'>
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="isExclusive" select="$isExclusive" />
                    </xsl:call-template>                    
                </xsl:for-each>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <!-- Control Types -->
    <!-- ============== -->
    <xsl:template name="m-input-singlelineedit">
        <!-- inserts a basic edit box -->
        <xsl:param name="InputType" />
        <xsl:param name="qGroup" />

        <xsl:element name="m-input-singlelineedit">
            <!-- pre label -->
            <xsl:element name="div">
                <xsl:attribute name="class">
                    <xsl:text>a-label-pre</xsl:text>
                </xsl:attribute>
                <xsl:comment>
                    <xsl:text>pre label</xsl:text>
                </xsl:comment>
            </xsl:element>

            <!-- input -->
            <xsl:call-template name="insert-input">
                <xsl:with-param name="InputType">
                    <xsl:value-of select="$InputType" />
                </xsl:with-param>
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <!-- post label -->
            <xsl:element name="div">
                <xsl:attribute name="class">
                    <xsl:text>a-label-post</xsl:text>
                </xsl:attribute>
                <xsl:comment>
                    <xsl:text>post label</xsl:text>
                </xsl:comment>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="m-option-base">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="isExclusive" select="'false'" />

        <xsl:element name="m-option-base">
            <xsl:variable name="qCategoryID">
                <xsl:value-of select="@ElementID" />
                <xsl:value-of select="Category/@CategoryID" />
            </xsl:variable>
            <xsl:attribute name="data-exclusive">
                <xsl:value-of select="$isExclusive" />
            </xsl:attribute>

            <xsl:attribute name="data-question-id">
                <xsl:value-of select="$qCategoryID" />
            </xsl:attribute>

            <xsl:attribute name="data-question-group">
                <xsl:value-of select="$qGroup" />
            </xsl:attribute>

            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="Style/@ElementAlign='NewLine'">
                        <xsl:text> below </xsl:text>
                    </xsl:when>
                    <xsl:when test="Style/@ElementAlign='Right'">
                        <xsl:text> side </xsl:text>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>

            <xsl:attribute name='data-hidden'>
                <xsl:choose>
                <xsl:when test="Style/@Hidden='true'">
                    <xsl:text>true</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>false</xsl:text>
                </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <xsl:call-template name="set-data-position">
                <xsl:with-param name="position" select="Style/@ElementAlign" />
            </xsl:call-template>

            <!-- hidden input -->
            <xsl:call-template name="insert-input-option">
                <xsl:with-param name="InputType">
                    <xsl:choose>
                        <xsl:when test="$isExclusive">
                            <xsl:text>radio</xsl:text>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>checkbox</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="isHidden" select="true()" />
                <xsl:with-param name="controlId" select="$qCategoryID" />
            </xsl:call-template>

            <!-- label-option -->
            <xsl:call-template name="insert-label-option">
                <xsl:with-param name="subType">
                    <xsl:choose>
                        <xsl:when test="$isExclusive='true'">
                            <xsl:text>radio</xsl:text>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>checkbox</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="controlId" select="$qCategoryID" />
            </xsl:call-template>

        </xsl:element>

    </xsl:template>

    <!-- Common Attributes -->
    <!-- ================= -->

    <xsl:template name="set-data-position">
        <!-- Sets the data-position attribute based on the ElementAlign atribute -->
        <xsl:param name="position" select="NewLine" />

        <xsl:attribute name="data-position">
            <xsl:choose>
                <xsl:when test="$position='NewLine'">
                    <xsl:text>below</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>side</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>
    <!-- Functions -->
    <!-- ========= -->

    <xsl:template name="funcGetQType">
        <!-- Calculate Question type from BgColor parameter -->
        <!-- Question type is declared to the left of the colon -->
        <xsl:param name="BgColor" />
        <xsl:variable name="qType">
            <xsl:choose>
                <xsl:when test="contains($BgColor, ':')">
                    <xsl:value-of select="substring-before($BgColor, ':')" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:value-of select="$qType"/>
    </xsl:template>

    <xsl:template name="funcGetQGroup">
        <!-- Calculate Question Name from BgColor parameter -->
        <!-- Question Name is declared to the right of the colon -->
        <xsl:param name="BgColor" />
        <xsl:variable name="qGroup">
            <xsl:choose>
                <xsl:when test="contains($BgColor, ':')">
                    <xsl:value-of select="substring-after($BgColor, ':')" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:value-of select="$qGroup"/>
    </xsl:template>
</xsl:stylesheet>