<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" version="1.0">
    <xsl:output method="xml" indent="yes" />
    <xsl:param name="bIncludeCSSStyles" select="true()" />
    <xsl:param name="bIncludeElementIds" select="true()" />
    <xsl:param name="sImageLocation" />
    <xsl:param name="bShowOnly" select="false()" />
    <xsl:param name="bAutoComplete" select="false()" />

    <xsl:strip-space elements="*"/>

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
        <xsl:param name="cellContext" />
        <!-- iterate through the question eleents in the XML structure -->
        <!-- question elements are contained within the questions element -->

        <xsl:variable name="BgColor">
            <xsl:choose>
                <xsl:when test="Style">
                    <xsl:value-of select="Style/@BgColor"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="Control[1]/Style/@BgColor"/>
                </xsl:otherwise>
            </xsl:choose>
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

        <xsl:variable name="qReadOnly">
            <xsl:choose>
                <xsl:when test="Style/Control/@ReadOnly">
                    <xsl:value-of select="true()"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="false()"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:element name="o-question">   
            <xsl:call-template name="response">
                <xsl:with-param name="qType" select="$qType"/>
                <xsl:with-param name="qGroup" select="$qGroup"/>
                <xsl:with-param name="cellContext" select="$cellContext"/>
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

    <xsl:template name="response">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" select="false()" />

        <xsl:element name="o-response">

            <xsl:attribute name="data-question-group">
                <xsl:value-of select="$qGroup" />  
            </xsl:attribute>

            <xsl:choose>
                <xsl:when test="Style">
                    <xsl:if test="Style/@Color">
                        <xsl:attribute name="data-properties">
                            <xsl:value-of select="Style/@Color" />
                        </xsl:attribute>
                    </xsl:if>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="data-properties">
                        <xsl:value-of select="Control[1]/Style/@Color"/>
                    </xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>

            <xsl:choose>
                <xsl:when test="Style">
                    <xsl:if test="Style/@ElementAlign">
                        <xsl:call-template name="set-data-position">
                            <xsl:with-param name="position" select="Style/@ElementAlign" />
                        </xsl:call-template>
                    </xsl:if>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="set-data-position">
                        <xsl:with-param name="position" select="Control[1]/Style/@ElementAlign" />
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:comment>type: <xsl:value-of select="$qType"/></xsl:comment>

            <!--- Adds class to define below/side position -->
            <xsl:call-template name="LaunchQType">
                <xsl:with-param name="qType" select="$qType"/>
                <xsl:with-param name="qGroup" select="$qGroup"/>
                <xsl:with-param name="cellContext" select="$cellContext"/>
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

    <!-- Sub-routines -->
    <!-- ============ -->
    <xsl:template name="LaunchQType">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" select="false()" />

        <xsl:choose>
            <xsl:when test="$qType='singleline'">
                <xsl:call-template name="singleline">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>

            <xsl:when test="$qType='singleline-number'">
                <xsl:call-template name="singleline">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'number'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>

            <xsl:when test="$qType='singleline-date'">
                <xsl:call-template name="singleline">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'date'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>

            <xsl:when test="$qType='choice'">
                <xsl:call-template name="choice">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>

            <xsl:when test="$qType='scale-horizontal'">
                <xsl:call-template name="scale">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'horizontal'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='scale-vertical'">
                <xsl:call-template name="scale">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'vertical'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='slider-horizontal'">
                <xsl:call-template name="slider">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'horizontal'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='slider-vertical'">
                <xsl:call-template name="slider">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="subType" select="'vertical'"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='tabstrip'">
                <xsl:call-template name="tabstrip">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='listbox'">
                <xsl:call-template name="listbox">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='combobox'">
                <xsl:call-template name="combobox">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$qType='dropdown'">
                <xsl:call-template name="dropdown">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>

            <xsl:when test="$qType='loop'">
                <xsl:call-template name="loop">
                    <xsl:with-param name="qType" select="$qType" />
                    <xsl:with-param name="qGroup" select="$qGroup"/>
                    <xsl:with-param name="Hidden" select="false()"/>
                    <xsl:with-param name="cellContext" select="$cellContext"/>
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="insert-input">
        <xsl:param name="inputType" select="text" />
        <xsl:param name="qGroup" />
        <xsl:param name="isHidden" select="false()" />
        <xsl:param name="applyWidth" select="true()" />
        <xsl:param name="currentValue" select="''" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="input">
            <!-- insert base attributes -->
            <xsl:call-template name="insert-common-input-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:attribute name="data-hidden">
                <xsl:value-of select="$isHidden" />
            </xsl:attribute>

            <xsl:if test="$cellContext != ''">
                <xsl:attribute name="aria-labelledby">
                    <xsl:value-of select="$cellContext" />
                </xsl:attribute>
            </xsl:if>

            <xsl:attribute name="id">
                <xsl:choose>
                    <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                        <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="@ElementID" />
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <!--- Set Input specific attributes -->
            <xsl:attribute name="type">
                <xsl:value-of select="$inputType"/>
            </xsl:attribute>

            <xsl:if test="$isHidden = false()">
                <xsl:attribute name="class">
                    <xsl:text>a-singleline</xsl:text>
                </xsl:attribute>
            </xsl:if>

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
            
            <xsl:variable name="alignment">
                <xsl:text>text-align:</xsl:text>
                <xsl:choose>
                    <xsl:when test="Style/@Align">
                        <xsl:value-of select="Style/@Align" />
                    </xsl:when>
                    <xsl:otherwise>   
                        <xsl:choose>
                            <xsl:when test="$inputType='number'">
                                <xsl:text>right</xsl:text>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>left</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:text>;</xsl:text>
            </xsl:variable>

            <xsl:attribute name="style">
                <xsl:value-of select="$alignment" />
                <xsl:choose>
                    <xsl:when test="Style/@Width">
                        <xsl:text> </xsl:text>
                        <xsl:text>width:</xsl:text>
                        <xsl:value-of select="Style/@Width" />
                        <xsl:text>;</xsl:text>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>

            <xsl:choose>
                <xsl:when test="$currentValue != ''">
                    <xsl:attribute name="value">
                        <xsl:value-of select="$currentValue" />
                    </xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="value">
                        <xsl:choose>
                            <xsl:when test="@Value != ''">
                                <xsl:value-of select="@Value" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="''" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>

            <xsl:if test="Style/Control/@Placeholder != ''">
                <xsl:attribute name="placeholder">
                    <xsl:value-of select='Style/Control/@Placeholder' />
                </xsl:attribute>
            </xsl:if>
            <!--- Accelerator access key -->
            <xsl:if test="Style/Control/@Accelerator != ''">
                <xsl:attribute name="accesskey">
                    <xsl:value-of select="Style/Control/@Accelerator" />
                </xsl:attribute>
            </xsl:if>

            <xsl:if test="$qReadOnly='true'">
                <xsl:attribute name="readonly">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="aria-disabled">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-input-option">
        <xsl:param name="inputType" select="radio" />
        <xsl:param name="qGroup" />
        <xsl:param name="isHidden" select="false()" />
        <xsl:param name="currentControl" />
        <xsl:param name="controlId" />
        <xsl:param name="qReadOnly" />

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
                <xsl:value-of select="$inputType"/>
            </xsl:attribute>

            <!--- Accelerator access key -->
            <xsl:if test="$currentControl/Style/Control/@Accelerator != ''">
                <xsl:attribute name="accesskey">
                    <xsl:value-of select="$currentControl/Style/Control/@Accelerator" />
                </xsl:attribute>
            </xsl:if>

            <xsl:attribute name="name">
                <xsl:value-of select="$currentControl/@QuestionName" />
            </xsl:attribute>

            <xsl:attribute name="value">
                <xsl:value-of select="$currentControl/Category/@Name" />
            </xsl:attribute>

            <xsl:if test="$currentControl/Category/@Checked">
                <xsl:attribute name="checked">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:if test="$currentControl/Style/Control/@ReadOnly or $qReadOnly='true'">
                <xsl:attribute name="readonly">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="aria-disabled">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>
            
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label">
        <xsl:param name="subType" />
        <xsl:element name="label">
            <xsl:attribute name="for">
                <xsl:value-of select="@ElementID" />
                <xsl:value-of select="@ElementId" />
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
                
                <xsl:call-template name="insert-label-text">
                    <xsl:with-param name="content" select="Text" />
                </xsl:call-template>      
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-heading">
        <xsl:param name="X" />
        <xsl:param name="Y" />  
        <xsl:param name="pClass" />
        <xsl:param name="tableName" />

        <xsl:variable name="cellContext">
            <xsl:choose>
                <xsl:when test="$X = 0">
                    <xsl:value-of select="concat($tableName, '!', 'R', $Y)" />
                </xsl:when>
                <xsl:when test="$Y = 0">
                    <xsl:value-of select="concat($tableName, '!', 'C', $X)" />
                </xsl:when> 
                <xsl:otherwise>
                    <xsl:value-of select="concat($tableName, '!', 'C', $X, 'R', $Y)" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>a-label-question</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="id">
                <xsl:value-of select="$cellContext" />
            </xsl:attribute>

            <xsl:call-template name="insert-label-text">
                <xsl:with-param name="content" select="Text" />
            </xsl:call-template>    
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-heading-sublist">
        <xsl:param name="labelXML" />
        <xsl:element name="legend">
            <xsl:element name="span">
                <xsl:attribute name="class">
                    <xsl:text>a-label-heading-sublist</xsl:text>
                </xsl:attribute>
                <xsl:call-template name="insert-common-labelstyle-attributes">
                    <xsl:with-param name="theNode" select="$labelXML" />
                </xsl:call-template>

                <xsl:call-template name="insert-label-text">
                    <xsl:with-param name="content" select="$labelXML/Text" />
                </xsl:call-template>      
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-option">
        <xsl:param name="subType" />
        <xsl:param name="currentControl" />
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
                    <xsl:text>a-label-option</xsl:text>
                </xsl:attribute>
                
                <xsl:call-template name="insert-common-labelstyle-attributes" />
                
                <xsl:call-template name="insert-label-text">
                    <xsl:with-param name="content" select="$currentControl/Category/Label/Text" />
                </xsl:call-template>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="insert-label-option-list">
        <xsl:param name="currentControl" />
        <xsl:element name="div">
            
            <xsl:call-template name="insert-label-icon-multistate">
                <xsl:with-param name="iconType" select="'listitem'" />
            </xsl:call-template>

            <xsl:element name="span">
                <xsl:attribute name="class">
                    <xsl:text>a-label-option</xsl:text>
                </xsl:attribute>
                
                <xsl:call-template name="insert-label-text">
                    <xsl:with-param name="content" select="$currentControl/Label/Text" />
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
            <xsl:comment>
                <xsl:text>Icon</xsl:text>
            </xsl:comment>
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
        <xsl:param name="theNode" select="." />
        <!-- adds all the attributes that are used in every input connected to the form -->
        <xsl:if test="$qGroup">
            <xsl:attribute name="data-question-group">
                <xsl:value-of select="$qGroup" />
            </xsl:attribute>
        </xsl:if>
        <!--- Set name, id, min, max, maxlength -->
        <xsl:attribute name="name">
            <xsl:value-of select="$theNode/@QuestionName" />
        </xsl:attribute>

        <!--- Show current response -->
        <xsl:if test="@Value">
            <xsl:attribute name="value">
                <xsl:value-of select="$theNode/@Value" />
            </xsl:attribute>
        </xsl:if>
    </xsl:template>

    <xsl:template name="insert-common-labelstyle-attributes">
    </xsl:template>

    <xsl:template name="insert-common-questiontype-attributes">
        <xsl:param name="qGroup" />
        <xsl:param name="qIdOverride" />

        <xsl:variable name="questionId">
            <xsl:choose>
                <xsl:when test="$qIdOverride != ''">
                    <xsl:value-of select="$qIdOverride" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                            <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="@ElementID" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:attribute name="data-question-group">
            <xsl:value-of select="$qGroup" />
        </xsl:attribute>

        <xsl:attribute name="data-question-id">
            <xsl:value-of select="$questionId" />
        </xsl:attribute>

    </xsl:template>

    <xsl:template name="process-option-rows">
        <xsl:param name="qGroup" />
        <xsl:param name="theRows" />
        <xsl:param name="cType" select="'choice'" />
        <xsl:param name="qReadOnly" />

        <xsl:comment>
            <xsl:text>count of rows in the table</xsl:text>
            <xsl:value-of select="count($theRows)" />
        </xsl:comment>

        <xsl:if test="count($theRows) > 0">
            <xsl:variable name="firstRow" select="$theRows[1]" />
            <xsl:variable name="controlType" select="$firstRow/Cell/Control/@Type" />
            <xsl:variable name="categoryID" select="$firstRow/Cell/Control/Category/@CategoryID" />
            <xsl:variable name="oOptionType">
                <xsl:choose>
                    <xsl:when test="$cType='choice'">
                        <xsl:text>o-option-sublist</xsl:text>
                    </xsl:when>
                    <xsl:when test="$cType='tabstrip'">
                        <xsl:text>o-option-tabstrip</xsl:text>
                    </xsl:when>
                </xsl:choose>
            </xsl:variable>
            <xsl:comment>
                <xsl:text>cType: </xsl:text>
                <xsl:value-of select="$cType" />
                <xsl:text>option Type: </xsl:text>
                <xsl:value-of select="$oOptionType" />
            </xsl:comment>
            <!-- Determine the rows to include in the current sublist -->
            <xsl:choose>
                <!-- Case 1: Static control -->
                <xsl:when test="$controlType = 'Static'">
                    <xsl:variable name="rowsInSublist" select="$theRows[starts-with(Cell/Control/Category/@CategoryID, concat($categoryID, '_S'))]" />   
                    <xsl:variable name="howManyRows" select="count($rowsInSublist)" />

                    <xsl:element name='fieldset'>
                        <xsl:attribute name="aria-describedby">
                            <xsl:value-of select="//@TableID" />
                            <xsl:text>_label_question</xsl:text>
                        </xsl:attribute>

                        <xsl:call-template name="insert-label-heading-sublist">
                            <xsl:with-param name="labelXML" select="$firstRow/Cell/Control/Category/Label" />
                        </xsl:call-template>

                        <xsl:element name="{$oOptionType}">
                            <xsl:for-each select="$rowsInSublist">

                                <xsl:variable name="typeOverride">
                                    <xsl:choose>
                                        <xsl:when test="Cell/Control/@Type = 'CheckButton'">
                                            <xsl:text>checkbox</xsl:text>
                                        </xsl:when>
                                        <xsl:when test="Cell/Control/@Type = 'RadioButton'">
                                            <xsl:text>radio</xsl:text>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:text>other</xsl:text>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:variable>

                                <xsl:if test="$typeOverride != 'other'">   
                                    <xsl:choose>
                                        <xsl:when test="$cType='choice'">
                                            <xsl:call-template name="m-option-base">
                                                <xsl:with-param name="qType" select="Cell/Control/@Type" />
                                                <xsl:with-param name="qGroup" select="$qGroup" />
                                                <xsl:with-param name="currentControl" select="Cell/Control" />
                                                <xsl:with-param name="typeOverride" select="$typeOverride" />
                                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                                <xsl:with-param name="otherQuestion" select="Cell/Question" />
                                            </xsl:call-template>
                                        </xsl:when>
                                        <xsl:when test="$cType='tabstrip'">
                                            <xsl:call-template name="m-option-tab">
                                                <xsl:with-param name="qType" select="Cell/Control/@Type" />
                                                <xsl:with-param name="qGroup" select="$qGroup" />
                                                <xsl:with-param name="currentControl" select="Cell/Control" />
                                                <xsl:with-param name="typeOverride" select="$typeOverride" />
                                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                            </xsl:call-template>
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:if>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:element>

                    <xsl:call-template name="process-option-rows">
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="theRows" select="$theRows[position() > $howManyRows + 1]" />
                        <xsl:with-param name="cType" select="$cType" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly" />
                    </xsl:call-template>
                </xsl:when>
                <!-- Case 2: Non-Static control -->
                <xsl:otherwise>
                    <xsl:variable name="nextStatic" select="$theRows[Cell/Control/@Type = 'Static'][1]" />
                    <xsl:variable name="nextStaticPosition" select="count($nextStatic/preceding-sibling::Row) + 1" />

                    <xsl:variable name="nextStaticIncrement">
                        <xsl:choose>
                            <xsl:when test="$nextStatic">
                                <xsl:value-of select="$nextStaticPosition - count($firstRow/preceding-sibling::Row)" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="count($theRows)" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <xsl:element name='fieldset'>
                        <xsl:attribute name="aria-describedby">
                            <xsl:value-of select="//@TableID" />
                            <xsl:text>_label_question</xsl:text>
                        </xsl:attribute>
                        <xsl:element name="{$oOptionType}">
                            <xsl:for-each select="$theRows[position() &lt; ($nextStaticIncrement + 1)]">

                                <xsl:variable name="typeOverride">
                                    <xsl:choose>
                                        <xsl:when test="Cell/Control/@Type = 'CheckButton'">
                                            <xsl:text>checkbox</xsl:text>
                                        </xsl:when>
                                        <xsl:when test="Cell/Control/@Type = 'RadioButton'">
                                            <xsl:text>radio</xsl:text>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:text>other</xsl:text>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:variable>
                                
                                <xsl:if test="$typeOverride != 'other'">
                                    <xsl:choose>
                                        <xsl:when test="$cType='choice'">
                                            <xsl:call-template name="m-option-base">
                                                <xsl:with-param name="qType" select="Cell/Control/@Type" />
                                                <xsl:with-param name="qGroup" select="$qGroup" />
                                                <xsl:with-param name="currentControl" select="Cell/Control" />
                                                <xsl:with-param name="typeOverride" select="$typeOverride" />
                                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                                <xsl:with-param name="otherQuestion" select="Cell/Question" />
                                            </xsl:call-template>
                                        </xsl:when>
                                        <xsl:when test="$cType='tabstrip'">
                                            <xsl:call-template name="m-option-tab">
                                                <xsl:with-param name="qType" select="Cell/Control/@Type" />
                                                <xsl:with-param name="qGroup" select="$qGroup" />
                                                <xsl:with-param name="currentControl" select="Cell/Control" />
                                                <xsl:with-param name="typeOverride" select="$typeOverride" />
                                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                            </xsl:call-template>
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:if>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:element>
                    <!-- Recurse with remaining rows -->
                    <xsl:variable name="remainingRows" select="$theRows[position() > $nextStaticIncrement]" />

                    <xsl:if test="$remainingRows">
                        <xsl:call-template name="process-option-rows">
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="theRows" select="$theRows[position() > $nextStaticIncrement - 1]" />
                            <xsl:with-param name="cType" select="$cType" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:if>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
    </xsl:template>


    <!-- Functions -->
    <!-- ========= -->
        <xsl:template name="rowOfNextStatic">
            <xsl:param name="theRows" />

            <xsl:variable name="firstStaticRow" select="$theRows[Cell/Control/@Type = 'Static'][1]"/>
            <xsl:variable name="positionInOriginalSet" select="count($firstStaticRow/preceding-sibling::*)"/>

            <xsl:value-of select="$positionInOriginalSet"/>
        </xsl:template>

        <xsl:template name="endOfSublist">
            <xsl:param name="theRows" />
            <xsl:param name="startPosition" select="-1" />
            <xsl:param name="currentCategoryID" />
            <xsl:param name="lastRow" />

            <xsl:for-each select="$theRows">
                <xsl:variable name="currentRow" select="$theRows[position()]" />
                <xsl:variable name="nextRow" select="$theRows[position()+1]" />
                <xsl:variable name="categoryID" select="$nextRow/Cell/Control/Category/@CategoryID" />
                <xsl:choose>
                    <xsl:when test="position() > $startPosition">
                            <xsl:if test="not(substring-before($categoryID, '_S')=$currentCategoryID)">
                                <xsl:value-of select="position()" />
                            </xsl:if>
                    </xsl:when>
                </xsl:choose>
            </xsl:for-each>
        </xsl:template>

    <!-- Response Types -->
    <!-- ============== -->

    <xsl:template name="singleline">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="subType" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionId">
            <xsl:value-of select="Control[./Style/Control/@Type='SingleLineEdit'][1]/@ElementID" />
        </xsl:variable>

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:for-each select="Label">
            <xsl:call-template name="insert-label">
                <xsl:with-param name="subType" select="'option'" />
            </xsl:call-template>
        </xsl:for-each>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="$questionId" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                        <xsl:call-template name='m-singleline'>
                            <xsl:with-param name="qGroup">
                                <xsl:value-of select="$qGroup" />
                            </xsl:with-param>
                            <xsl:with-param name="subType" select="$subType" />
                            <xsl:with-param name="cellContext" select="$cellContext"/>
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="$questionId" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                    <xsl:call-template name='m-singleline'>
                        <xsl:with-param name="qGroup">
                            <xsl:value-of select="$qGroup" />
                        </xsl:with-param>
                        <xsl:with-param name="subType" select="$subType" />
                        <xsl:with-param name="cellContext" select="$cellContext"/>
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="choice">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="o-choice">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:for-each select="Table">
                <xsl:call-template name="process-option-rows">
                    <xsl:with-param name="qGroup" select="$qGroup" />
                    <xsl:with-param name="theRows" select="Row" />
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:for-each>
        </xsl:element>

    </xsl:template>

    <xsl:template name="scale">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionId">
            <xsl:value-of select="Control[./Style/Control/@Type='SingleLineEdit'][1]/@ElementID" />
        </xsl:variable>

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="$questionId" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                        <xsl:call-template name='o-scale'>
                            <xsl:with-param name="qGroup">
                                <xsl:value-of select="$qGroup" />
                            </xsl:with-param>
                            <xsl:with-param name="subType">
                                <xsl:value-of select="$subType" />
                            </xsl:with-param>
                            <xsl:with-param name="cellContext" select="$cellContext"/>
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="$questionId" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                    <xsl:call-template name='o-scale'>
                        <xsl:with-param name="qGroup">
                            <xsl:value-of select="$qGroup" />
                        </xsl:with-param>
                        <xsl:with-param name="subType">
                            <xsl:value-of select="$subType" />
                        </xsl:with-param>
                        <xsl:with-param name="cellContext" select="$cellContext"/>
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="slider">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionId">
            <xsl:value-of select="Control[./Style/Control/@Type='SingleLineEdit'][1]/@ElementID" />
        </xsl:variable>

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="$questionId" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                        <xsl:call-template name='o-slider'>
                            <xsl:with-param name="qGroup">
                                <xsl:value-of select="$qGroup" />
                            </xsl:with-param>
                            <xsl:with-param name="subType">
                                <xsl:value-of select="$subType" />
                            </xsl:with-param>
                            <xsl:with-param name="cellContext" select="$cellContext"/>
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="$questionId" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control[./Style/Control/@Type='SingleLineEdit']">
                    <xsl:call-template name='o-slider'>
                        <xsl:with-param name="qGroup">
                            <xsl:value-of select="$qGroup" />
                        </xsl:with-param>
                        <xsl:with-param name="subType">
                            <xsl:value-of select="$subType" />
                        </xsl:with-param>
                        <xsl:with-param name="cellContext" select="$cellContext"/>
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="tabstrip">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="o-tabstrip">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>

            <xsl:for-each select="Table">
            <xsl:call-template name="process-option-rows">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="theRows" select="Row" />
                <xsl:with-param name="cType" select="'tabstrip'" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>

    <xsl:template name="listbox">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='ListBox')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="@ElementID" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control[@Type = 'ListBox']">
                        <xsl:variable name="questionID">
                            <xsl:choose>
                                <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                                    <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="@ElementID" />
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>

                        <xsl:choose>
                            <xsl:when test="@Type = 'ListBox'">
                                <xsl:call-template name="o-list">
                                    <xsl:with-param name="qGroup" select="$qGroup" />
                                    <xsl:with-param name="qID" select="$questionID" />
                                    <xsl:with-param name="cellContext" select="$cellContext"/>
                                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                </xsl:call-template>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:comment>
                                    <xsl:text>Skipping control of type: </xsl:text>
                                    <xsl:value-of select="@Type" />
                                </xsl:comment>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="Control[1]/@ElementID" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control[@Type = 'ListBox']">
                    <xsl:variable name="questionID">
                        <xsl:choose>
                            <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                                <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="@ElementID" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>

                    <xsl:choose>
                        <xsl:when test="@Type = 'ListBox'">
                            <xsl:call-template name="o-list">
                                <xsl:with-param name="qGroup" select="$qGroup" />
                                <xsl:with-param name="qID" select="$questionID" />
                                <xsl:with-param name="cellContext" select="$cellContext"/>
                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                            </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:comment>
                                <xsl:text>Skipping control of type: </xsl:text>
                                <xsl:value-of select="@Type" />
                            </xsl:comment>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template name="combobox">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />
        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="@ElementID" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control">
                        <xsl:choose>
                            <xsl:when test="@Type = 'ComboList'">
                                <xsl:call-template name="o-combobox">
                                    <xsl:with-param name="qGroup" select="$qGroup" />
                                    <xsl:with-param name="cellContext" select="$cellContext"/>
                                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                </xsl:call-template>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:comment>
                                    <xsl:text>Skipping control of type: </xsl:text>
                                    <xsl:value-of select="@Type" />
                                </xsl:comment>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="Control[1]/@ElementID" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control">
                    <xsl:choose>
                        <xsl:when test="@Type = 'ComboList'">
                            <xsl:call-template name="o-combobox">
                                <xsl:with-param name="qGroup" select="$qGroup" />
                                <xsl:with-param name="cellContext" select="$cellContext"/>
                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                            </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:comment>
                                <xsl:text>Skipping control of type: </xsl:text>
                                <xsl:value-of select="@Type" />
                            </xsl:comment>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template name="dropdown">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="fieldset">
                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="@ElementID" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>
                
                    <xsl:for-each select="Control">
                        <xsl:choose>
                            <xsl:when test="@Type = 'DropList'">
                                <xsl:call-template name="o-dropdown">
                                    <xsl:with-param name="qGroup" select="$qGroup" />
                                    <xsl:with-param name="cellContext" select="$cellContext"/>
                                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                                </xsl:call-template>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:comment>
                                    <xsl:text>Skipping control of type: </xsl:text>
                                    <xsl:value-of select="@Type" />
                                </xsl:comment>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="Control[1]/@ElementID" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Control">
                    <xsl:choose>
                        <xsl:when test="@Type = 'DropList'">
                            <xsl:call-template name="o-dropdown">
                                <xsl:with-param name="qGroup" select="$qGroup" />
                                <xsl:with-param name="cellContext" select="$cellContext"/>
                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                            </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:comment>
                                <xsl:text>Skipping control of type: </xsl:text>
                                <xsl:value-of select="@Type" />
                            </xsl:comment>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template name="loop">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="Hidden" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionId">
            <xsl:value-of select="Control[./Style/Control/@Type='SingleLineEdit'][1]/@ElementID" />
        </xsl:variable>

        <xsl:variable name="optionCount">
            <xsl:value-of select="count(Control[not(./Style/Control/@Type='SingleLineEdit')])" />
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$optionCount > 0">
                <xsl:element name="div">              
                    <xsl:for-each select="Table">
                        <xsl:call-template name='loopTable'>
                            <xsl:with-param name="qGroup">
                                <xsl:value-of select="$qGroup" />
                            </xsl:with-param>
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>

                    <xsl:call-template name="o-option-sublist">
                        <xsl:with-param name="qType" select="$qType" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="questionId" select="$questionId" />
                        <xsl:with-param name="optionCount" select="$optionCount" />
                        <xsl:with-param name="typeOverride" select="'checkbox'" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:for-each select="Table">
                    <xsl:call-template name='loopTable'>
                        <xsl:with-param name="qGroup">
                            <xsl:value-of select="$qGroup" />
                        </xsl:with-param>
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Table Structure -->
    <!-- ============== -->
    <xsl:template name="loopTable">
        <xsl:param name="qGroup" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="tableName" select="@TableName"/>
        <xsl:element name="o-loop">
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>o-structure-table</xsl:text>
                </xsl:attribute>
                <xsl:variable name="rows" select="Row"/>
                <!-- Find the split point: first row with a cell with a class -->
                <xsl:variable name="firstCategoryRowPos"
                    select="count($rows[Cell[@Class]][1]/preceding-sibling::Row) + 1"/>
                <xsl:variable name="headerRows"
                    select="$rows[position() &lt; $firstCategoryRowPos]"/>
                <xsl:variable name="bodyRows"
                    select="$rows[position() &gt;= $firstCategoryRowPos]"/>
                <!-- Use loopTitle for thead -->
                <xsl:call-template name="loopTopTitles">
                    <xsl:with-param name="rows" select="$headerRows"/>
                </xsl:call-template>
                <tbody>
                    <xsl:for-each select="$bodyRows">
                        <xsl:call-template name="loopRow">
                            <xsl:with-param name="qGroup" select="$qGroup"/>
                            <xsl:with-param name="tableName" select="$tableName" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>
                </tbody>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template name="loopRow">
        <xsl:param name="qGroup" />
        <xsl:param name="tableName" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="tr">
            <xsl:attribute name="Y">
                <xsl:value-of select="@Y" />
            </xsl:attribute>
            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="Cell[@Class and @X != 0]">
                        <xsl:text>m-structure-row-heading</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:text>m-structure-row</xsl:text>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <xsl:for-each select="Cell">
                <xsl:sort select="@X" data-type="number" order="ascending"/>
                <xsl:call-template name="loopCell">
                    <xsl:with-param name="qGroup" select="$qGroup" />
                    <xsl:with-param name="currentCell" select="." />
                    <xsl:with-param name="tableName" select="$tableName" />
                    <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                </xsl:call-template>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>

    <xsl:template name="loopCell">
        <xsl:param name="qGroup" />
        <xsl:param name="currentCell" />
        <xsl:param name="tableName" />
        <xsl:param name="qReadOnly" />
        
        <xsl:variable name="cellContext">
            <xsl:value-of select="concat($tableName, '!C', @X, ' ', $tableName, '!R', @Y)" />
        </xsl:variable>

        <xsl:variable name="cellType">
            <xsl:choose>
                <xsl:when test="name(*[1]) = 'Label'">
                    <xsl:text>th</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>th</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:element name="{$cellType}">
            <xsl:attribute name="X">
                <xsl:value-of select="@X" />
            </xsl:attribute>

            <xsl:attribute name="Y">
                <xsl:value-of select="@Y" />
            </xsl:attribute>

            <xsl:if test="@WeightY">
                <xsl:attribute name="rowspan">
                    <xsl:value-of select="@WeightY" />
                </xsl:attribute>
            </xsl:if>

            <xsl:if test="@WeightX">
                <xsl:attribute name="colspan">
                    <xsl:value-of select="@WeightX" />
                </xsl:attribute>
            </xsl:if>

            <xsl:attribute name="class">
                <xsl:text>m-structure-cell</xsl:text>
            </xsl:attribute>
            <xsl:choose>
                <xsl:when test="Label">
                    <xsl:attribute name="scope">
                        <xsl:choose>
                            <xsl:when test="@X = 0">
                                <xsl:text>row</xsl:text>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>col</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>

                    <xsl:variable name="styleVerticalAlign">
                        <xsl:if test="Style/@VerticalAlign">
                            <xsl:text>vertical-align:</xsl:text>
                            <xsl:value-of select="Style/@VerticalAlign" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleHorizontalAlign">
                        <xsl:if test="Style/@Align">
                            <xsl:text>text-align:</xsl:text>
                            <xsl:value-of select="Style/@Align" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleWidth">
                        <xsl:if test="Style/Cell/@Width">
                            <xsl:text>width:</xsl:text>
                            <xsl:value-of select="Style/Cell/@Width" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:if test="$styleVerticalAlign or $styleHorizontalAlign or $styleWidth">
                        <xsl:attribute name="style">
                            <xsl:value-of select="$styleVerticalAlign" />
                            <xsl:value-of select="$styleHorizontalAlign" />
                            <xsl:value-of select="$styleWidth" />
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:for-each select="Label">
                        <xsl:call-template name="insert-label-heading">
                            <xsl:with-param name="X" select="../@X" />
                            <xsl:with-param name="Y" select="../@Y" />
                            <xsl:with-param name="pClass" select="../@Class" />
                            <xsl:with-param name="tableName" select="$tableName" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>
                    
                </xsl:when>
                <xsl:when test="Question">
                    <xsl:variable name="styleVerticalAlign">
                        <xsl:if test="Question/Style/@VerticalAlign">
                            <xsl:text>vertical-align:</xsl:text>
                            <xsl:value-of select="Style/@VerticalAlign" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleHorizontalAlign">
                        <xsl:if test="Question/Style/@Align">
                            <xsl:text>text-align:</xsl:text>
                            <xsl:value-of select="Style/@Align" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleWidth">
                        <xsl:if test="Question/Style/Cell/@Width">
                            <xsl:text>width:</xsl:text>
                            <xsl:value-of select="Style/Cell/@Width" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:if test="$styleVerticalAlign or $styleHorizontalAlign or $styleWidth">
                        <xsl:attribute name="style">
                            <xsl:value-of select="$styleVerticalAlign" />
                            <xsl:value-of select="$styleHorizontalAlign" />
                            <xsl:value-of select="$styleWidth" />
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:for-each select="Question">
                        <xsl:call-template name="Question">
                            <xsl:with-param name="cellContext" select="$cellContext" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>
                </xsl:when>
                <xsl:when test="Control">
                    <xsl:variable name="styleVerticalAlign">
                        <xsl:if test="Style/@VerticalAlign">
                            <xsl:text>vertical-align:</xsl:text>
                            <xsl:value-of select="Style/@VerticalAlign" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleHorizontalAlign">
                        <xsl:if test="Style/@Align">
                            <xsl:text>text-align:</xsl:text>
                            <xsl:value-of select="Style/@Align" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:variable name="styleWidth">
                        <xsl:if test="Style/Cell/@Width">
                            <xsl:text>width:</xsl:text>
                            <xsl:value-of select="Style/Cell/@Width" />
                            <xsl:text>; </xsl:text>
                        </xsl:if>
                    </xsl:variable>
                    <xsl:if test="$styleVerticalAlign or $styleHorizontalAlign or $styleWidth">
                        <xsl:attribute name="style">
                            <xsl:value-of select="$styleVerticalAlign" />
                            <xsl:value-of select="$styleHorizontalAlign" />
                            <xsl:value-of select="$styleWidth" />
                        </xsl:attribute>
                    </xsl:if>

                    <xsl:call-template name="Question">
                        <xsl:with-param name="cellContext" select="$cellContext" />
                        <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:when test="Error">
                    <!-- handle Error if needed -->
                </xsl:when>
            </xsl:choose>
        </xsl:element>
    </xsl:template>

    <xsl:template name="loopCellHeading">
        <xsl:param name="scope" />
        <xsl:param name="currentCell" />

        <xsl:element name="th">
            <xsl:attribute name="scope">
                <xsl:value-of select="$scope" />
            </xsl:attribute>

            <xsl:for-each select="Label">
                <xsl:call-template name="insert-label-heading">
                    <xsl:with-param name="X" select="$currentCell/@X" />
                    <xsl:with-param name="Y" select="$currentCell/@Y" />
                    <xsl:with-param name="pClass" select="$currentCell/@Class" />
                </xsl:call-template>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>

    <xsl:template name="loopTopTitles">
        <xsl:param name="rows" />
        <xsl:element name="thead">
            <xsl:for-each select="$rows">
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>m-structure-row-heading</xsl:text>
                    </xsl:attribute>
                    <xsl:for-each select="Cell">
                        <xsl:choose>
                            <xsl:when test="@Class = 'mrGridCategoryText'">
                                <xsl:call-template name="loopCellHeading">
                                    <xsl:with-param name="scope" select="'col'" />
                                    <xsl:with-param name="currentCell" select="." />
                                </xsl:call-template>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:element name="td" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>

    <!-- Organisms -->
    <!-- ============== -->

    <xsl:template name="o-scale">
            <!-- inserts a basic edit box -->
        <xsl:param name="qGroup" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="o-scale">
            <xsl:attribute name="data-orientation">
                <xsl:value-of select="$subType" />
            </xsl:attribute>

            <xsl:if test="Style/@Width">
                <xsl:attribute name="style">
                    <xsl:text>width: </xsl:text>
                    <xsl:value-of select="Style/@Width" />
                    <xsl:text>;</xsl:text>
                </xsl:attribute>
            </xsl:if>
            
            <xsl:choose>
                <xsl:when test="$subType='horizontal'">
                    <xsl:call-template name="m-label-prepost" />

                    <xsl:call-template name="m-scale-container">
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="minimum" select="@MinValue" />
                        <xsl:with-param name="maximum" select="@MaxValue" />
                    </xsl:call-template>

                    <xsl:call-template name="insert-input">
                            <xsl:with-param name="inputType" select="'number'" />
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="isHidden" select="true()" />
                            <xsl:with-param name="applyWidth" select="false()" />
                            <xsl:with-param name="cellContext" select="$cellContext" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:when> 
                <xsl:when test="$subType='vertical'">
                    <xsl:call-template name="a-label-post" />               

                    <xsl:call-template name="m-scale-container">
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="minimum" select="@MinValue" />
                        <xsl:with-param name="maximum" select="@MaxValue" />
                    </xsl:call-template>

                    <xsl:call-template name="insert-input">
                            <xsl:with-param name="inputType" select="'number'" />
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="isHidden" select="true()" />
                            <xsl:with-param name="applyWidth" select="false()" />
                            <xsl:with-param name="cellContext" select="$cellContext" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>

                    <xsl:call-template name="a-label-post" />
                </xsl:when>
            </xsl:choose>               
        </xsl:element>
    </xsl:template>

    <xsl:template name="o-slider">
            <!-- inserts a basic edit box -->
        <xsl:param name="qGroup" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="o-slider">
            <xsl:attribute name="data-orientation">
                <xsl:value-of select="$subType" />
            </xsl:attribute>

            <xsl:if test="Style/@Width">
                <xsl:attribute name="style">
                    <xsl:text>width: </xsl:text>
                    <xsl:value-of select="Style/@Width" />
                    <xsl:text>;</xsl:text>
                </xsl:attribute>
            </xsl:if>
    
            <xsl:call-template name="m-label-prepost" />
    
            <xsl:choose>
                <xsl:when test="$subType='horizontal'">

                    <xsl:call-template name="o-slider-container">
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="minimum" select="@MinValue" />
                        <xsl:with-param name="maximum" select="@MaxValue" />
                    </xsl:call-template>

                    <xsl:call-template name="insert-input">
                            <xsl:with-param name="inputType" select="'hidden'" />
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="isHidden" select="true()" />
                            <xsl:with-param name="applyWidth" select="false()" />
                            <xsl:with-param name="cellContext" select="$cellContext" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>
                </xsl:when> 
                <xsl:when test="$subType='vertical'">
                    <xsl:call-template name="a-label-post" />

                    <xsl:call-template name="o-slider-container">
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="minimum" select="@MinValue" />
                        <xsl:with-param name="maximum" select="@MaxValue" />
                    </xsl:call-template>

                    <xsl:call-template name="insert-input">
                            <xsl:with-param name="inputType" select="'number'" />
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="isHidden" select="true()" />
                            <xsl:with-param name="applyWidth" select="false()" />
                            <xsl:with-param name="cellContext" select="$cellContext" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                    </xsl:call-template>

                    <xsl:call-template name="a-label-post" />
                </xsl:when>
            </xsl:choose>
                      
        </xsl:element>
    </xsl:template>

    <xsl:template name="o-slider-container">
        <xsl:param name="qGroup" />
        <xsl:param name="minimum" select="1" />
        <xsl:param name="maximum" select="10" />

        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:text>o-slider-container</xsl:text>
            </xsl:attribute> 

            <xsl:call-template name="a-label-pre" />

            <xsl:element name="a-button-terminator">
                <xsl:attribute name="data-behaviour">
                    <xsl:text>decrement</xsl:text>
                </xsl:attribute>
                <xsl:comment>Pre-terminator</xsl:comment>
            </xsl:element>

            <xsl:call-template name="m-slider-track">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="minimum" select="$minimum" />
                <xsl:with-param name="maximum" select="$maximum" />
            </xsl:call-template>

            <xsl:element name="a-button-terminator">
                <xsl:attribute name="data-behaviour">
                    <xsl:text>increment</xsl:text>
                </xsl:attribute>
                <xsl:comment>Post-terminator</xsl:comment>
            </xsl:element> 

            <xsl:call-template name="a-label-post" />
        </xsl:element>
    </xsl:template>

    <xsl:template name="o-combobox">
            <!-- inserts a basic edit box -->
        <xsl:param name="qGroup" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionID">
            <xsl:choose>
                <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                    <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="@ElementID" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:element name="o-combobox">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:attribute name="class">
                <xsl:text>o-select-custom</xsl:text>
            </xsl:attribute>

            <xsl:if test="Style/@Width">
                <xsl:attribute name="style">
                    <xsl:text>width: </xsl:text>
                    <xsl:value-of select="Style/@Width" />
                    <xsl:text>;</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:element name="input">
                <xsl:attribute name="id">
                    <xsl:value-of select="$questionID" />
                    <xsl:text>_control</xsl:text>
                </xsl:attribute>
                
                <xsl:attribute name="type">
                    <xsl:text>text</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="class">
                    <xsl:text>a-input-combobox</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="placeholder">
                    <xsl:value-of select="Style/Control/@Placeholder" />
                </xsl:attribute>

            </xsl:element>

            <xsl:call-template name="o-list">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="qID">
                    <xsl:value-of select="$questionID" />
                    <xsl:text>_list</xsl:text>
                </xsl:with-param>
                <xsl:with-param name="cellContext" select="$cellContext"/>
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

    <xsl:template name="o-dropdown">
            <!-- inserts a basic edit box -->
        <xsl:param name="qGroup" />
        <xsl:param name="subType" select="'horizontal'" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="questionID">
            <xsl:choose>
                <xsl:when test="substring(@ElementID, string-length(@ElementID) - 1) = '_C'">
                    <xsl:value-of select="substring(@ElementID, 1, string-length(@ElementID) - 2)" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="@ElementID" />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        
        <xsl:element name="o-dropdown">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <xsl:attribute name="class">
                <xsl:text>o-select-custom</xsl:text>
            </xsl:attribute>

            <xsl:if test="Style/@Width">
                <xsl:attribute name="style">
                    <xsl:text>width: </xsl:text>
                    <xsl:value-of select="Style/@Width" />
                    <xsl:text>;</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:element name="input">
                <xsl:attribute name="id">
                    <xsl:value-of select="$questionID" />
                    <xsl:text>_control</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="type">
                    <xsl:text>text</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="class">
                    <xsl:text>a-input-dropdown</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="placeholder">
                    <xsl:value-of select="Style/Control/@Placeholder" />
                </xsl:attribute>
            </xsl:element>

            <xsl:call-template name="o-list">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="qID">
                    <xsl:value-of select="$questionID" />
                    <xsl:text>_list</xsl:text>
                </xsl:with-param>
                <xsl:with-param name="cellContext" select="$cellContext"/>
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

    <xsl:template name="o-list">
        <xsl:param name="qGroup" />
        <xsl:param name="qID" />
        <xsl:param name="cellContext" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="o-list">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="qIdOverride" select="$qID" />
            </xsl:call-template>

            <xsl:attribute name="tabindex">
                <xsl:text>0</xsl:text>
            </xsl:attribute>

            <xsl:attribute name="id">
                <xsl:value-of select="$qID" />
                <xsl:text>_list</xsl:text>
            </xsl:attribute>

            <xsl:variable name="categories" select="Category" />

            <xsl:element name="ul">
                <xsl:attribute name="class">
                    <xsl:text>o-list</xsl:text>
                </xsl:attribute>
                <xsl:variable name="ElementID">
                    <xsl:value-of select="@ElementID" />
                </xsl:variable>

                <xsl:for-each select="$categories">
                    <xsl:call-template name="m-list-option">
                        <xsl:with-param name="qType" select="@Type" />
                        <xsl:with-param name="qGroup" select="$qGroup" />
                        <xsl:with-param name="ElementID" select="$ElementID" />
                        <xsl:with-param name="currentControl" select="." />
                    </xsl:call-template>
                </xsl:for-each>
            </xsl:element>

            <xsl:variable name="selectedCategory">
                <xsl:for-each select="$categories[@Checked='true']">
                    <xsl:value-of select="@Name"/>
                    <xsl:if test="position() != last()">,</xsl:if>
                </xsl:for-each>
            </xsl:variable>

            <xsl:call-template name="insert-input">
                <xsl:with-param name="inputType" select="'hidden'" />
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="isHidden" select="true()" />
                <xsl:with-param name="currentValue" select="$selectedCategory" />
                <xsl:with-param name="cellContext" select="$cellContext" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

<!-- Molecules -->
<!-- ============== -->

    <xsl:template name="m-scale-container">
        <xsl:param name="qGroup" />
        <xsl:param name="minimum" select="1" />
        <xsl:param name="maximum" select="10" />
        <xsl:element name="m-scale-container">

            <xsl:call-template name="loop-between">
                <xsl:with-param name="start" select="$minimum" />
                <xsl:with-param name="end" select="$maximum" />
                <xsl:with-param name="increment" select="1" />
                <xsl:with-param name="sAction" select="'a-scale-unit'" />
            </xsl:call-template>
        </xsl:element>    
    </xsl:template>

    <xsl:template name="m-label-prepost">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:text>m-label-prepost</xsl:text>
            </xsl:attribute>
            <xsl:call-template name="a-label-pre" />
            <xsl:call-template name="a-label-post" />
        </xsl:element>
    </xsl:template>

    <xsl:template name="m-singleline">
        <!-- inserts a basic edit box -->
        <xsl:param name="qGroup" />
        <xsl:param name="subType" />
        <xsl:param name="cellContext" select="''" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="subTypeElement">
            <xsl:text>m-singleline</xsl:text>
            <xsl:if test="$subType != ''">
                <xsl:text>-</xsl:text>
                <xsl:value-of select="$subType" />
            </xsl:if>
        </xsl:variable>

        <xsl:element name="{$subTypeElement}">
            <xsl:call-template name="insert-common-questiontype-attributes">
                <xsl:with-param name="qGroup" select="$qGroup" />
            </xsl:call-template>

            <!-- pre label -->
            <xsl:call-template name="a-label-pre" />
            
            <!-- input -->
            <xsl:call-template name="insert-input">
                <xsl:with-param name="inputType">
                    <xsl:choose>
                        <xsl:when test="$subType != ''">
                            <xsl:value-of select="$subType" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>text</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="cellContext" select="$cellContext" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>

            <!-- post label -->
            <xsl:call-template name="a-label-post" />
        </xsl:element>
    </xsl:template>

    <xsl:template name="m-option-base">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="typeOverride" />
        <xsl:param name="currentControl" />
        <xsl:param name="qReadOnly" />
        <xsl:param name="otherQuestion" />

        <xsl:variable name="currentCategory" select="$currentControl/Category" />

        <xsl:variable name="qCategoryID">
            <xsl:value-of select="concat($currentControl/@ElementID, $currentCategory/@CategoryID)" />
        </xsl:variable>

        <xsl:element name="m-option-base">
            <xsl:variable name="isExclusive">
                <xsl:choose>
                    <xsl:when test="$currentControl/@Type='CheckButton'">
                        <xsl:choose>
                            <xsl:when test="$currentCategory/Label/Style/Font/@IsBold">
                                <xsl:text>true</xsl:text>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>false</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:when test="$currentControl/@Type='RadioButton'">
                        <xsl:text>true</xsl:text>
                    </xsl:when>
                </xsl:choose>
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

            <xsl:if test="$currentControl/Style/Control/@ReadOnly or $qReadOnly='true'">
                <xsl:attribute name="readonly">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>

                <xsl:attribute name="aria-disabled">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:if test="$currentControl/Category/@Checked">
                <xsl:attribute name="data-checked">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="$currentControl/Style/@ElementAlign='NewLine'">
                        <xsl:text> below </xsl:text>
                    </xsl:when>
                    <xsl:when test="$currentControl/Style/@ElementAlign='Right'">
                        <xsl:text> side </xsl:text>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>

            <xsl:attribute name='data-hidden'>
                <xsl:choose>
                <xsl:when test="$currentControl/Style/@Hidden='true'">
                    <xsl:text>true</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>false</xsl:text>
                </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <xsl:call-template name="set-data-position">
                <xsl:with-param name="position" select="$currentControl/Style/@ElementAlign" />
            </xsl:call-template>

            <xsl:call-template name="insert-input-option">
                <xsl:with-param name="inputType">
                    <xsl:choose>
                        <xsl:when test="$typeOverride">
                            <xsl:value-of select="$typeOverride" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:choose>
                                <xsl:when test="$isExclusive='true'">
                                    <xsl:text>radio</xsl:text>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:text>checkbox</xsl:text>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="isHidden" select="true()" />
                <xsl:with-param name="currentControl" select="$currentControl" />
                <xsl:with-param name="controlId" select="$qCategoryID" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
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
                <xsl:with-param name="currentControl" select="$currentControl" />
                <xsl:with-param name="controlId" select="$qCategoryID" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>

            <xsl:if test="$otherQuestion">
                <xsl:comment>
                    <xsl:text>Other Question</xsl:text>
                </xsl:comment>
                <xsl:for-each select="$otherQuestion">
                    <xsl:call-template name="Question" />
                </xsl:for-each>
            </xsl:if>
        </xsl:element>

    </xsl:template>

    <xsl:template name="m-option-tab">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="typeOverride" />
        <xsl:param name="currentControl" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="currentCategory" select="$currentControl/Category" />

        <xsl:variable name="qCategoryID">
            <xsl:value-of select="concat($currentControl/@ElementID, $currentCategory/@CategoryID)" />
        </xsl:variable>

        <xsl:element name="m-option-tab">
            <xsl:variable name="isExclusive">
                <xsl:choose>
                    <xsl:when test="$currentControl/@Type='CheckButton'">
                        <xsl:choose>
                            <xsl:when test="$currentCategory/Label/Style/Font/@IsBold">
                                <xsl:text>true</xsl:text>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text>false</xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:when test="$currentControl/@Type='RadioButton'">
                        <xsl:text>true</xsl:text>
                    </xsl:when>
                </xsl:choose>
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

            <xsl:if test="$currentControl/Category/@Checked">
                <xsl:attribute name="data-checked">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:if test="$currentControl/Style/Control/@ReadOnly or $qReadOnly='true'">
                <xsl:attribute name="readonly">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
                <xsl:attribute name="aria-disabled">
                    <xsl:text>true</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="$currentControl/Style/@ElementAlign='NewLine'">
                        <xsl:text> below </xsl:text>
                    </xsl:when>
                    <xsl:when test="$currentControl/Style/@ElementAlign='Right'">
                        <xsl:text> side </xsl:text>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>

            <xsl:attribute name='data-hidden'>
                <xsl:choose>
                <xsl:when test="$currentControl/Style/@Hidden='true'">
                    <xsl:text>true</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>false</xsl:text>
                </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <xsl:call-template name="set-data-position">
                <xsl:with-param name="position" select="$currentControl/Style/@ElementAlign" />
            </xsl:call-template>

            <xsl:call-template name="insert-input-option">
                <xsl:with-param name="inputType">
                    <xsl:choose>
                        <xsl:when test="$typeOverride">
                            <xsl:value-of select="$typeOverride" />
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:choose>
                                <xsl:when test="$isExclusive='true'">
                                    <xsl:text>radio</xsl:text>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:text>checkbox</xsl:text>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="qGroup" select="$qGroup" />
                <xsl:with-param name="isHidden" select="true()" />
                <xsl:with-param name="currentControl" select="$currentControl" />
                <xsl:with-param name="controlId" select="$qCategoryID" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
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
                <xsl:with-param name="currentControl" select="$currentControl" />
                <xsl:with-param name="controlId" select="$qCategoryID" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>
        </xsl:element>
    </xsl:template>

    <xsl:template name="m-slider-track">
        <xsl:param name="qGroup" />
        <xsl:param name="minimum" />
        <xsl:param name="maximum" />
            <xsl:element name="m-slider-track">

                <xsl:element name="output">
                    <xsl:attribute name="class">
                        <xsl:text>a-label-thumb</xsl:text>
                    </xsl:attribute>
                    <xsl:attribute name="type"><xsl:text>range</xsl:text></xsl:attribute>
                    <xsl:attribute name="for">
                        <xsl:value-of select="concat(@ElementID, '_range')" />
                    </xsl:attribute>
                    <xsl:comment>thumb</xsl:comment>
                </xsl:element>

                <xsl:element name="input">
                    <xsl:attribute name="type">
                        <xsl:text>range</xsl:text>
                    </xsl:attribute>
                    <xsl:attribute name="id">
                        <xsl:value-of select="concat(@ElementID, '_range')" />
                    </xsl:attribute>
                    <xsl:attribute name="min">
                        <xsl:value-of select="$minimum" />
                    </xsl:attribute>
                    <xsl:attribute name="max">
                        <xsl:value-of select="$maximum" />
                    </xsl:attribute>
                    <xsl:attribute name="class">
                        <xsl:text>a-slider-input</xsl:text>
                    </xsl:attribute>
                </xsl:element>

                <xsl:element name="div">
                    <xsl:attribute name="class">
                        <xsl:text>m-divider-marks</xsl:text>
                    </xsl:attribute>
                    <xsl:comment>divider marks</xsl:comment>
                </xsl:element>

                <xsl:element name="div">
                    <xsl:attribute name="class">
                        <xsl:text>m-label-marks</xsl:text>
                    </xsl:attribute>
                    <xsl:comment>label marks</xsl:comment>
                </xsl:element> 
            </xsl:element> 
 
    </xsl:template>

    <xsl:template name="m-list-option">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="ElementID" />
        <xsl:param name="currentControl" />
        <xsl:param name="qReadOnly" />

        <xsl:element name="li">
            <xsl:attribute name="id">
                <xsl:value-of select="$ElementID" />
                <xsl:value-of select="@CategoryID" />
            </xsl:attribute>
            
            <xsl:attribute name="class">
                <xsl:text>m-list-option</xsl:text>
            </xsl:attribute>
            
            <xsl:attribute name="data-value">
                <xsl:value-of select="@Name" />
            </xsl:attribute>

            <!-- label-option -->
            <xsl:call-template name="insert-label-option-list">
                <xsl:with-param name="currentControl" select="$currentControl" />
                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
            </xsl:call-template>

        </xsl:element>
    </xsl:template>

    <!-- Atoms -->
    <!-- ===== -->

    <xsl:template name="a-label-pre">
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>a-label-pre</xsl:text>
            </xsl:attribute>
            <xsl:comment>
                <xsl:text>pre label</xsl:text>
            </xsl:comment>
        </xsl:element>
    </xsl:template>

    <xsl:template name="a-label-post">
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>a-label-post</xsl:text>
            </xsl:attribute>
            <xsl:comment>
                <xsl:text>post label</xsl:text>
            </xsl:comment>
        </xsl:element>
    </xsl:template>

    <xsl:template name="a-scale-unit">
        <xsl:param name="data-value" />
        <xsl:element name="a-scale-unit">
            <xsl:attribute name="data-value">
                <xsl:value-of select="$data-value" />
            </xsl:attribute>
            <xsl:value-of select="$data-value" />
        </xsl:element>
    </xsl:template>

    <!-- List Structures -->
    <!-- =============== -->
    <xsl:template name="o-option-sublist">
        <xsl:param name="qType" />
        <xsl:param name="qGroup" />
        <xsl:param name="questionId" />
        <xsl:param name="optionCount" />
        <xsl:param name="nonOptionCount" select="1" />
        <xsl:param name="typeOverride" />
        <xsl:param name="qReadOnly" />

        <xsl:variable name="includeFieldset">
            <xsl:choose>
                <xsl:when test="qType='choice'"> 
                    <xsl:choose>
                        <xsl:when test="$optionCount > 1">
                            <xsl:text>true</xsl:text>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:text>false</xsl:text>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>false</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
            
        <xsl:element name="o-option-sublist">
            <xsl:if test="$includeFieldset='false'">
                <xsl:attribute name="role"><xsl:text>group</xsl:text></xsl:attribute>

                <xsl:attribute name='aria-describedby'>
                    <xsl:value-of select="$questionId" />
                    <xsl:text>_label_question</xsl:text>
                </xsl:attribute>
            </xsl:if>

            <xsl:choose>
                <xsl:when test="$includeFieldset='true'">
                    <xsl:element name="fieldset">
                        <xsl:attribute name="aria-describedby">
                            <xsl:value-of select="$questionId" />
                            <xsl:text>_label_question</xsl:text>
                        </xsl:attribute>
                        <!-- not(./Style/Control/@Type='SingleLineEdit') -->
                        <xsl:for-each select="Control[position()>$nonOptionCount]">
                            <xsl:call-template name="m-option-base">
                                <xsl:with-param name="qType" select="@Type" />
                                <xsl:with-param name="qGroup" select="$qGroup" />
                                <xsl:with-param name="currentControl" select="." />
                                <xsl:with-param name="typeOverride" select="$typeOverride" />
                                <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                            </xsl:call-template>
                        </xsl:for-each>
                    </xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="role"><xsl:text>group</xsl:text></xsl:attribute>

                    <xsl:attribute name="aria-describedby">
                        <xsl:value-of select="$questionId" />
                        <xsl:text>_label_question</xsl:text>
                    </xsl:attribute>

                    <xsl:for-each select="Control[position()>$nonOptionCount]">
                        <xsl:call-template name="m-option-base">
                            <xsl:with-param name="qType" select="@Type" />
                            <xsl:with-param name="qGroup" select="$qGroup" />
                            <xsl:with-param name="currentControl" select="." />
                            <xsl:with-param name="typeOverride" select="$typeOverride" />
                            <xsl:with-param name="qReadOnly" select="$qReadOnly"/>
                        </xsl:call-template>
                    </xsl:for-each>
                </xsl:otherwise>
            </xsl:choose>
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

    <xsl:template name="loop-between">
        <xsl:param name="start" select="1" />
        <xsl:param name="end" select="1" />
        <xsl:param name="increment" select="1" />
        <xsl:param name="sAction" select="nothing" />

        <xsl:choose>
            <xsl:when test="$sAction = 'a-scale-unit'">
                <xsl:call-template name="a-scale-unit">
                    <xsl:with-param name="data-value" select="$start" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$sAction = 'nothing'">
                <xsl:comment>
                    <xsl:text>Do nothing</xsl:text>
                </xsl:comment>
            </xsl:when>
        </xsl:choose>

        <xsl:if test="$start &lt; $end">
            <xsl:call-template name="loop-between">
                <xsl:with-param name="start" select="$start + $increment" />
                <xsl:with-param name="end" select="$end" />
                <xsl:with-param name="increment" select="$increment" />
                <xsl:with-param name="sAction" select="$sAction" />
            </xsl:call-template>
        </xsl:if>

    </xsl:template>

</xsl:stylesheet>